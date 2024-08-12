document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('addProduct').addEventListener('click', function () {
        const table = document.getElementById('productTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td><input type="text" class="form-control" placeholder="Descrição" required></td>
            <td><input type="text" class="form-control" placeholder="Unidade de Medida" required></td>
            <td><input type="number" class="form-control" placeholder="Quantidade em Estoque" required></td>
            <td><input type="number" step="0.01" class="form-control" placeholder="Valor Unitário" required></td>
            <td><input type="text" class="form-control" placeholder="Valor Total" readonly required></td>
        `;
    });


    document.getElementById('addAttachment').addEventListener('click', function () {
        const table = document.getElementById('attachmentTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td><input type="file" class="form-control" required></td>
            <td>
                <button type="button" class="btn btn-danger deleteAttachment">Excluir</button>
                <button type="button" class="btn btn-primary viewAttachment">Visualizar</button>
            </td>
        `;
    });


    document.getElementById('attachmentTable').addEventListener('click', function (e) {
        if (e.target.classList.contains('deleteAttachment')) {
            const row = e.target.closest('tr');
            row.remove();
        } else if (e.target.classList.contains('viewAttachment')) {
            const fileInput = e.target.closest('tr').querySelector('input[type="file"]');
            const file = fileInput.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                window.open(url, '_blank');
            }
        }
    });


    document.getElementById('cep').addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');
        if (cep) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('endereco').value = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
                    } else {
                        alert('CEP não encontrado.');
                    }
                })
                .catch(error => {
                    alert('Erro ao buscar CEP.');
                    console.error(error);
                });
        }
    });


    document.getElementById('productTable').addEventListener('input', function (e) {
        if (e.target.closest('tr')) {
            const row = e.target.closest('tr');
            const quantidade = row.querySelector('input[type="number"]').value;
            const valorUnitario = row.querySelectorAll('input[type="number"]')[1].value;
            const valorTotalInput = row.querySelector('input[readonly]');

            if (quantidade && valorUnitario) {
                valorTotalInput.value = (quantidade * valorUnitario).toFixed(2);
            }
        }
    });


    document.getElementById('saveSupplier').addEventListener('click', function () {
        const formData = new FormData(document.getElementById('supplierForm'));
        const products = [];
        const attachments = [];

        document.querySelectorAll('#productTable tbody tr').forEach(row => {
            const descricao = row.querySelectorAll('input[type="text"]')[0].value;
            const unidadeMedida = row.querySelectorAll('input[type="text"]')[1].value;
            const quantidade = row.querySelectorAll('input[type="number"]')[0].value;
            const valorUnitario = row.querySelectorAll('input[type="number"]')[1].value;
            const valorTotal = row.querySelector('input[readonly]').value;

            if (descricao && unidadeMedida && quantidade && valorUnitario && valorTotal) {
                products.push({ descricao, unidadeMedida, quantidade, valorUnitario, valorTotal });
            }
        });

        document.querySelectorAll('#attachmentTable tbody tr').forEach(row => {
            const fileInput = row.querySelector('input[type="file"]');
            const file = fileInput.files[0];
            if (file) {
                attachments.push(file);
            }
        });

        const supplierData = {
            razaoSocial: formData.get('razaoSocial'),
            nomeFantasia: formData.get('nomeFantasia'),
            cnpj: formData.get('cnpj'),
            inscricaoEstadual: formData.get('inscricaoEstadual'),
            inscricaoMunicipal: formData.get('inscricaoMunicipal'),
            endereco: formData.get('endereco'),
            nomeContato: formData.get('nomeContato'),
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            products,
            attachments,
        };

        console.log(supplierData);
    
    });

});


