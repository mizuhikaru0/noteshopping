document.addEventListener("DOMContentLoaded", function() {
  const productImage = document.getElementById('productImage');
  const preview = document.getElementById('preview');
  const productForm = document.getElementById('productForm');
  const addProductBtn = document.getElementById('addProduct');
  const productTableBody = document.getElementById('productTable').querySelector('tbody');
  const grandTotalDisplay = document.getElementById('grandTotal');

  let products = [];
  let currentEditId = null;

  function renderTable() {
    productTableBody.innerHTML = "";
    products.forEach(product => {
      addProductToTable(product);
    });
    updateGrandTotal();
  }

  function loadProducts() {
    const storedProducts = localStorage.getItem("products");
    if(storedProducts) {
      try {
        products = JSON.parse(storedProducts);
      } catch (e) {
        console.error("Error parsing products dari localStorage:", e);
        products = [];
      }
    }
    renderTable();
  }

  function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
  }

  function updateGrandTotal() {
    const grandTotal = products.reduce((sum, product) => sum + product.total, 0);
    grandTotalDisplay.textContent = grandTotal.toFixed(2);
  }

  function addProductToTable(product) {
    const tr = document.createElement('tr');
    tr.setAttribute("data-id", product.id);
    tr.innerHTML = `
      <td>${product.image ? `<img src="${product.image}" width="50">` : "No Image"}</td>
      <td>${product.name}</td>
      <td>${parseFloat(product.price).toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>${product.location.charAt(0).toUpperCase() + product.location.slice(1)}</td>
      <td>${parseFloat(product.total).toFixed(2)}</td>
      <td>
        <button class="btn btn-warning edit-btn" data-id="${product.id}">Edit</button>
        <button class="btn btn-danger delete-btn" data-id="${product.id}">Hapus</button>
      </td>
    `;
    productTableBody.appendChild(tr);
  }

  function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    saveProducts();
    renderTable();
  }

  function resetForm() {
    productForm.reset();
    preview.src = "";
    preview.classList.add('d-none');
    currentEditId = null;
    addProductBtn.textContent = "Tambah Produk";
  }
  
  // Preview gambar saat diupload
  productImage.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.classList.remove('d-none');
      }      
      reader.readAsDataURL(file);
    }
  });

  // Event handler untuk tambah atau update produk
  addProductBtn.addEventListener('click', function(){
    const productName = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('price').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const purchaseLocation = document.getElementById('location').value;
    const imageSrc = preview.src || '';
    const totalPrice = price * quantity;

    console.log('Menambahkan produk:', { productName, price, quantity, purchaseLocation, imageSrc, totalPrice });

    if(productName === "" || price <= 0){
      alert("Pastikan nama produk terisi dan harga lebih dari 0.");
      return;
    }

    if (currentEditId) {
      products = products.map(product => {
        if(product.id === currentEditId) {
          return {
            ...product,
            image: imageSrc || product.image,
            name: productName,
            price: price,
            quantity: quantity,
            location: purchaseLocation,
            total: totalPrice
          };
        }
        return product;
      });
    } else {
      const product = {
        id: Date.now().toString(),
        image: imageSrc,
        name: productName,
        price: price,
        quantity: quantity,
        location: purchaseLocation,
        total: totalPrice
      };
      products.push(product);
    }
    saveProducts();
    renderTable();
    resetForm();
  });

  // Event delegation untuk tombol edit dan hapus
  productTableBody.addEventListener('click', function(e) {
    const id = e.target.getAttribute('data-id');
    if(e.target && e.target.classList.contains('delete-btn')){
      deleteProduct(id);
    } else if(e.target && e.target.classList.contains('edit-btn')){
      const productToEdit = products.find(product => product.id === id);
      if(productToEdit) {
        currentEditId = id;
        document.getElementById('productName').value = productToEdit.name;
        document.getElementById('price').value = productToEdit.price;
        document.getElementById('quantity').value = productToEdit.quantity;
        document.getElementById('location').value = productToEdit.location;
        if(productToEdit.image) {
          preview.src = productToEdit.image;
          preview.classList.remove('d-none');
        } else {
          preview.src = "";
          preview.classList.add('d-none');
        }        
        addProductBtn.textContent = "Simpan Perubahan";
      }
    }
  });

  loadProducts();
});
