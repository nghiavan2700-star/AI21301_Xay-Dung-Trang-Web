// Giai doan 2 - demo client-side interactivity (no payment or backend)
(() => {
  const notify=(message)=>{
    document.querySelector('.toast')?.remove();
    const box=document.createElement('div');box.className='toast';box.setAttribute('role','status');box.textContent=message;
    document.body.appendChild(box);setTimeout(()=>box.remove(),3500);
  };
  const cartKey='crocs_demo_cart';
  const getCart=()=>{try{return JSON.parse(localStorage.getItem(cartKey)||'[]')}catch{return []}};
  const refreshCart=()=>document.querySelectorAll('.header-icon span').forEach(el=>{if(el.textContent.includes('🛒')){el.setAttribute('title','Giỏ hàng demo: '+getCart().length+' sản phẩm');el.setAttribute('role','button');el.setAttribute('tabindex','0')}});
  document.querySelectorAll('.add-to-cart').forEach(button=>button.addEventListener('click',()=>{
    const card=button.closest('.card');const item={name:card.querySelector('h3')?.textContent.trim(),price:card.querySelector('p')?.textContent.trim()};
    const cart=getCart();cart.push(item);localStorage.setItem(cartKey,JSON.stringify(cart));refreshCart();notify('Đã thêm '+item.name+' vào giỏ hàng demo ('+cart.length+' sản phẩm).');
  }));
  document.querySelectorAll('.header-icon span').forEach(el=>{
    if(el.textContent.includes('🛒')){
      const view=()=>{const cart=getCart();notify(cart.length?('Giỏ hàng demo có '+cart.length+' sản phẩm. Chưa có chức năng thanh toán.'):'Giỏ hàng demo đang trống.');};
      el.addEventListener('click',view);el.addEventListener('keydown',e=>{if(e.key==='Enter')view()});
    }
    if(el.textContent.includes('🔍')){
      el.title='Tìm sản phẩm';el.setAttribute('role','button');el.tabIndex=0;
      const find=()=>{const q=window.prompt('Nhập tên sản phẩm cần tìm:');if(q?.trim())window.location.href='san-pham.html?q='+encodeURIComponent(q.trim());};
      el.addEventListener('click',find);el.addEventListener('keydown',e=>{if(e.key==='Enter')find()});
    }
  });
  const q=new URLSearchParams(location.search).get('q');
  if(q && document.querySelector('.products')){
    let visible=0;document.querySelectorAll('.products .card').forEach(card=>{const found=card.textContent.toLocaleLowerCase('vi').includes(q.toLocaleLowerCase('vi'));card.hidden=!found;if(found)visible++});
    const title=document.querySelector('.container .title');if(title)title.textContent='Kết quả tìm kiếm: '+q+' ('+visible+')';
  }
  document.querySelectorAll('.feedback-form,.contact-form').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const records=JSON.parse(localStorage.getItem('crocs_demo_submissions')||'[]');
    const payload={page:location.pathname,createdAt:new Date().toISOString()};
    form.querySelectorAll('input,select,textarea').forEach(field=>{if(field.type==='radio'||field.type==='checkbox'){if(field.checked)payload[field.name||field.id||'consent']=field.value||'yes'}else payload[field.name||field.id||'field']=field.value});
    records.push(payload);localStorage.setItem('crocs_demo_submissions',JSON.stringify(records));
    notify('Đã lưu thông tin trên trình duyệt (bản demo). Chưa gửi lên máy chủ.');form.reset();
  }));
  document.querySelectorAll('.newsletter-form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(form.reportValidity()){notify('Đây là biểu mẫu demo, chưa kết nối dịch vụ email.');form.reset();}}));
  refreshCart();
})();
