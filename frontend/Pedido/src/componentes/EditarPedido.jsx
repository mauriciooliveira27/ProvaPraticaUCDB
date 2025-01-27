import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './EditarPedido.css'; // Importando o CSS

const EditarPedido = () => {
  const [pedido, setPedido] = useState({});
  const [descontoAplicado, setDescontoAplicado] = useState(false); // Novo estado para controlar a lógica
  const [podeAplicarDesconto, setPodeAplicarDesconto] = useState(false); // Estado para controlar se pode aplicar desconto
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Pega os detalhes do pedido com base no id
    axios.get(`http://localhost:5006/api/pedido/${id}`)
      .then((response) => {
        setPedido(response.data);
        setDescontoAplicado(response.data.desconto_aplicado == 1); // Atualiza o estado com base na API

        // Verifica a data de vencimento para definir se o campo de desconto pode ser habilitado
        const dataVencimento = new Date(response.data.data_vencimento);
        const dataAtual = new Date();
        
        // Habilita o campo de desconto apenas se a data de vencimento for posterior ao dia de hoje
        setPodeAplicarDesconto(dataVencimento > dataAtual);
      })
      .catch((error) => {
        console.error("Erro ao buscar o pedido", error);
      });
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Atualiza o pedido
    axios.put(`http://localhost:5006/api/pedido/${id}`, pedido)
      .then(() => {
        // Navega de volta para a página de listagem de pedidos
        navigate("/");
      })
      .catch((error) => {
        console.error("Erro ao atualizar o pedido", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPedido((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCancel = () => {
    // Navega de volta para a página de listagem de pedidos
    navigate("/");
  };

  // Garantir que o campo valor_desconto tenha um valor padrão de 0
  const valorDesconto = pedido.valor_desconto || 0;

  return (
    <div>
      <h2>Editar Pedido</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            name="pedidoId"
            value={pedido.pedidoId || ''}
            readOnly
          />
        </div>
        <div>
          <label>Valor:</label>
          <input
            type="text"
            name="valor"
            value={pedido.valor || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Data de Vencimento:</label>
          <input
            type="date"
            name="data_vencimento"
            value={pedido.data_vencimento || ''}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label>Nome do Produto:</label>
          <input
            type="text"
            name="nome_produto"
            value={pedido.nome_produto || ''}
            onChange={handleChange}
          />
        </div>
        
        {/* Campo valor_desconto apenas editável se desconto_aplicado for 1 e se a data de vencimento for posterior ao dia atual */}
        <div>
  <label> Desconto %:</label>
  <input
    type="number"
    name="valor_desconto"
    value={valorDesconto}
    onChange={(event) => {
      const newValue = Math.min(event.target.value, 30); // Limita o valor a 30
      handleChange({ target: { name: 'valor_desconto', value: newValue } });
    }}
    disabled={!descontoAplicado || !podeAplicarDesconto} // Habilita o campo apenas se o desconto foi aplicado e a data de vencimento for posterior ao dia atual
    max="30" // Define o valor máximo permitido como 30
  />
</div>

        <div className="buttons-container">
          <button type="submit">Salvar</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditarPedido;
