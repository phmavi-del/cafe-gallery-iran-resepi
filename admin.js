

let editId = null;
alert("JS CONNECTED");
console.log("admin js loaded");
console.log("ADMIN JS LOADED");
function getRecipes(){
  return JSON.parse(localStorage.getItem("recipes") || "[]");
}

function setRecipes(data){
  localStorage.setItem("recipes", JSON.stringify(data));
}

function toBase64(file){
  return new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// ===== ذخیره =====
async function saveRecipe(){

  let title = document.getElementById("rTitle").value;
  let category = document.getElementById("rCategory").value;
  let text = document.getElementById("rText").value;
  let file = document.getElementById("rImageFile").files[0];

  let image = "";

  if(file){
    image = await toBase64(file);
  }

  let recipes = getRecipes();

  if(editId){
    recipes = recipes.map(r =>
      r.id === editId
        ? {...r, title, category, text, image: image || r.image}
        : r
    );
    editId = null;
  } else {
    recipes.push({
      id: Date.now(),
      title,
      category,
      text,
      image
    });
  }

  setRecipes(recipes);

  clearForm();
  renderRecipes();
  loadCategories();
}

// ===== نمایش =====
function renderRecipes(){

  let recipes = getRecipes();

  let search = document.getElementById("searchBox")?.value?.toLowerCase() || "";
  let filter = document.getElementById("filterCategory")?.value || "";

  if(search){
    recipes = recipes.filter(r =>
      r.title.toLowerCase().includes(search) ||
      r.text.toLowerCase().includes(search)
    );
  }

  if(filter){
    recipes = recipes.filter(r => r.category === filter);
  }

  let box = document.getElementById("recipeList");
  if(!box) return;

  box.innerHTML = recipes.length ? recipes.map(r => `
    <div class="card">

      ${r.image ? `<img src="${r.image}">` : ""}

      <h3>${r.title}</h3>
      <small>${r.category}</small>
      <p>${r.text}</p>

      <button onclick="editRecipe(${r.id})">ویرایش</button>
      <button onclick="deleteRecipe(${r.id})" style="color:red">حذف</button>

    </div>
  `).join("") : "<p>هیچ رسپی ثبت نشده</p>";
}

// ===== حذف =====
function deleteRecipe(id){
  setRecipes(getRecipes().filter(r => r.id !== id));
  renderRecipes();
  loadCategories();
}

// ===== ویرایش =====
function editRecipe(id){
  let r = getRecipes().find(x => x.id === id);
  if(!r) return;

  document.getElementById("rTitle").value = r.title;
  document.getElementById("rCategory").value = r.category;
  document.getElementById("rText").value = r.text;

  editId = id;
}

// ===== پاک کردن =====
function clearForm(){
  document.getElementById("rTitle").value = "";
  document.getElementById("rCategory").value = "";
  document.getElementById("rText").value = "";
  document.getElementById("rImageFile").value = "";
}

// ===== دسته بندی =====
function loadCategories(){

  let select = document.getElementById("filterCategory");
  if(!select) return;

  let cats = [...new Set(getRecipes().map(r => r.category))];

  select.innerHTML =
    `<option value="">همه دسته‌ها</option>` +
    cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

// ===== اجرا =====
document.addEventListener("DOMContentLoaded", ()=>{
  renderRecipes();
  loadCategories();
});