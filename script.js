document.addEventListener("DOMContentLoaded", function() {
    const productImage = document.getElementById('productImage');
    const preview = document.getElementById('preview');
    const productForm = document.getElementById('productForm');
    const addProductBtn = document.getElementById('addProduct');
    const productTableBody = document.getElementById('productTable').querySelector('tbody');
    const grandTotalDisplay = document.getElementById('grandTotal');
  
    // Array untuk menyimpan produk
    let products = [];
  
    // Load data dari localStorage jika ada
    function loadProducts() {
      const storedProducts = localStorage.getItem("products");
      if(storedProducts) {
        products = JSON.parse(storedProducts);
        products.forEach(product => {
          addProductToTable(product);
        });
        updateGrandTotal();
      }
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
  
    // Buat dan tambahkan baris produk ke tabel
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
        <td><button class="delete-btn" data-id="${product.id}">Hapus</button></td>
      `;
      productTableBody.appendChild(tr);
    }
  
    // Hapus produk berdasarkan id
    function deleteProduct(id) {
      // Hapus dari array produk
      products = products.filter(product => product.id !== id);
      // Simpan perubahan ke localStorage
      saveProducts();
      // Hapus baris dari tabel
      const row = productTableBody.querySelector(`tr[data-id="${id}"]`);
      if(row) {
        productTableBody.removeChild(row);
      }
      // Update grand total
      updateGrandTotal();
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
  
    // Tambahkan produk ke dalam daftar dan localStorage
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
  
      // Buat objek produk dengan id unik
      const product = {
        id: Date.now().toString(),
        image: imageSrc,
        name: productName,
        price: price,
        quantity: quantity,
        location: location,
        total: totalPrice
      };
  
      // Tambahkan produk ke array dan simpan ke localStorage
      products.push(product);
      saveProducts();
  
      // Tambahkan baris produk ke tabel
      addProductToTable(product);
      updateGrandTotal();
  
      // Reset form dan preview
      productForm.reset();
      preview.style.display = 'none';
    });
  
    // Event delegation untuk tombol hapus produk
    productTableBody.addEventListener('click', function(e) {
      if(e.target && e.target.classList.contains('delete-btn')){
        const id = e.target.getAttribute('data-id');
        deleteProduct(id);
      }
    });
  
    // Muat data produk dari localStorage saat halaman dimuat
    loadProducts();
  });
  