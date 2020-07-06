var mainApp 

(function(){
    var uid = null
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          uid = user.uid
        } else {
            uid = null
            window.location.replace("login.html")

        }
      });

      const logout = document.getElementById('log-out')
      function logOut(){
          firebase.auth().signOut()
      }

      logout.addEventListener('click', function(){
        mainApp.logOut = logOut()
      })
      
})()

const db = firebase.firestore()
const category = document.getElementById('crop-category-list')
const form = document.getElementById('add-crop-category')



function renderCategory(doc){
  let tr = document.createElement('tr')
  let name = document.createElement('td')
  let sortOrder = document.createElement('td')
  let active = document.createElement('td')
  let image = document.createElement('td')
  let avatar = document.createElement('img')
  let cross = document.createElement('div')
  
  cross.classList.add("style-cross")
  image.classList.add("text-overflow")
  avatar.setAttribute('src', doc.data().image)
  avatar.setAttribute('alt', 'image')
  avatar.setAttribute('class','avatar-style')
  tr.setAttribute('data-id', doc.id)
  name.textContent = doc.data().name
  sortOrder.textContent = doc.data().sortOrder
  active.textContent = doc.data().active
  // image.textContent = doc.data().image
  image.appendChild(avatar)
  cross.innerHTML = '<i class="material-icons">delete</i>'
  
  // name.appendChild(document.createTextNode(doc.data().name))

  tr.appendChild(name)
  tr.appendChild(image)
  tr.appendChild(sortOrder)
  tr.appendChild(active)
  tr.appendChild(cross)

  category.appendChild(tr)
 
  //deleting data
  cross.addEventListener('click', (e) =>{
    e.stopPropagation()
    let id = e.target.parentElement.getAttribute('data-id')
    db.collection('cropCategories').doc(id).delete()
  })
 }
 

//getting data
// db.collection('cropCategories').get().then((snapshot) =>{
//   snapshot.docs.forEach(doc =>{
//     renderCategory(doc)
//   })
// })

//saving data
form.addEventListener('submit', (e)  =>{
  e.preventDefault()
  db.collection('cropCategories').add({
    name: form.name.value,
    image: form.image.value,
    sortOrder: form.sortOrder.value,
    active: form.active.value
  })
  form.name.value = ''
  form.image.value = ''
  form.sortOrder.value = ''
  form.active.value = ''
})

//real time listener
db.collection('cropCategories').orderBy('name').onSnapshot(snapshot => {
  let changes = snapshot.docChanges()
  changes.forEach(change => {
    if(change.type == 'added'){
      renderCategory(change.doc)
    } else if(change.type == 'removed') {
      let li = category.querySelector('[data-id=' + change.doc.id + ']')
      category.removeChild(li)
    }
  })
})

// const cropCatNav = document.getElementById('crop-category-nav')
// const cropCatContainer = document.getElementById('crop-category-container')

// cropCatNav.addEventListener('click', function(){
//   cropCatContainer.classList.add("hide-container")
// })
