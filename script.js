document.addEventListener("DOMContentLoaded", function() {
  const productImage = document.getElementById('productImage');
  const preview = document.getElementById('preview');
  const productForm = document.getElementById('productForm');
  const addProductBtn = document.getElementById('addProduct');
  const productTableBody = document.getElementById('productTable').querySelector('tbody');
  const grandTotalDisplay = document.getElementById('grandTotal');

  // Array untuk menyimpan produk dan variabel untuk mode edit
  let products = [];
  let currentEditId = null;

  // Render ulang seluruh tabel berdasarkan array produk
  function renderTable() {
    productTableBody.innerHTML = "";
    products.forEach(product => {
      addProductToTable(product);
    });
    updateGrandTotal();
  }

  // Load data dari localStorage
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

  // Simpan array produk ke localStorage
  function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Update tampilan grand total
  function updateGrandTotal() {
    const grandTotal = products.reduce((sum, product) => sum + product.total, 0);
    grandTotalDisplay.textContent = grandTotal.toFixed(2);
  }

  // Tambahkan satu baris produk ke tabel
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
        <button class="edit-btn" data-id="${product.id}">Edit</button>
        <button class="delete-btn" data-id="${product.id}">Hapus</button>
      </td>
    `;
    productTableBody.appendChild(tr);
  }

  // Hapus produk berdasarkan id, lalu render ulang tabel
  function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    saveProducts();
    renderTable();
  }

  // Reset form dan preview, serta mode edit
  function resetForm() {
    productForm.reset();
    preview.src = "";
    preview.style.display = 'none';
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
        preview.style.display = 'block';
      }
      reader.readAsDataURL(file);
    }
  });

  // Tambahkan atau update produk ketika tombol diklik
  addProductBtn.addEventListener('click', function(){
    const productName = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('price').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const location = document.getElementById('location').value;
    const imageSrc = preview.src || '';
    const totalPrice = price * quantity;

    if(productName === "" || price <= 0){
      alert("Pastikan nama produk terisi dan harga lebih dari 0.");
      return;
    }

    if (currentEditId) {
      // Update produk yang sudah ada
      products = products.map(product => {
        if(product.id === currentEditId) {
          return {
            ...product,
            image: imageSrc || product.image, // jika gambar baru tidak diupload, tetap gunakan gambar lama
            name: productName,
            price: price,
            quantity: quantity,
            location: location,
            total: totalPrice
          };
        }
        return product;
      });
    } else {
      // Tambahkan produk baru
      const product = {
        id: Date.now().toString(),
        image: imageSrc,
        name: productName,
        price: price,
        quantity: quantity,
        location: location,
        total: totalPrice
      };
      products.push(product);
    }
    saveProducts();
    renderTable();
    resetForm();
  });

  // Event delegation untuk tombol hapus dan edit produk
  productTableBody.addEventListener('click', function(e) {
    const id = e.target.getAttribute('data-id');
    if(e.target && e.target.classList.contains('delete-btn')){
      deleteProduct(id);
    } else if(e.target && e.target.classList.contains('edit-btn')){
      // Cari produk yang akan diedit
      const productToEdit = products.find(product => product.id === id);
      if(productToEdit) {
        currentEditId = id;
        // Isi form dengan data produk yang akan diedit
        document.getElementById('productName').value = productToEdit.name;
        document.getElementById('price').value = productToEdit.price;
        document.getElementById('quantity').value = productToEdit.quantity;
        document.getElementById('location').value = productToEdit.location;
        if(productToEdit.image) {
          preview.src = productToEdit.image;
          preview.style.display = 'block';
        } else {
          preview.src = "";
          preview.style.display = 'none';
        }
        addProductBtn.textContent = "Simpan Perubahan";
      }
    }
  });

  // Muat data produk dari localStorage saat halaman dimuat
  loadProducts();
});
