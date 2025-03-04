document.addEventListener("DOMContentLoaded", function() {
    const productImage = document.getElementById('productImage');
    const preview = document.getElementById('preview');
    const productForm = document.getElementById('productForm');
    const addProductBtn = document.getElementById('addProduct');
    const productTableBody = document.getElementById('productTable').querySelector('tbody');
    const grandTotalDisplay = document.getElementById('grandTotal');
    let grandTotal = 0;
  
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
  
    // Tambahkan produk ke dalam tabel
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
  
      const tr = document.createElement('tr');
  
      tr.innerHTML = `
        <td>${imageSrc ? `<img src="${imageSrc}" width="50">` : "No Image"}</td>
        <td>${productName}</td>
        <td>${price.toFixed(2)}</td>
        <td>${quantity}</td>
        <td>${location.charAt(0).toUpperCase() + location.slice(1)}</td>
        <td>${totalPrice.toFixed(2)}</td>
      `;
  
      productTableBody.appendChild(tr);
  
      grandTotal += totalPrice;
      grandTotalDisplay.textContent = grandTotal.toFixed(2);
  
      productForm.reset();
      preview.style.display = 'none';
    });
  });
  