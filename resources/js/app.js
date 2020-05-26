require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router'
import { Form, HasError, AlertError } from 'vform'
import moment from 'moment';
import VueProgressBar from 'vue-progressbar'
import swal from 'sweetalert2'
import Gate from './components/Gate';
Vue.prototype.$gate = new Gate(window.user);

let routes = [
  { path: '/home', component: require('./components/Dashboard.vue').default },
  { path: '/dashboard', component: require('./components/Dashboard.vue').default },
  { path: '/user', component: require('./components/Users.vue').default },
  { path: '/developer', component: require('./components/Developer.vue').default },
  { path: '/profile', component: require('./components/Profile.vue').default },
  { path: '/*', component: require('./components/NotFound.vue').default }
]
const router = new VueRouter({
	mode: 'history',
  routes // short for `routes: routes`
})



Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
Vue.component('pagination', require('laravel-vue-pagination'));

window.Form = Form;
Vue.use(VueRouter);


// sweetalert2
window.Swal = swal;

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

window.toast = toast;

//custom event to load users
let Fire = new Vue();
window.Fire = Fire;

Vue.filter('upText',function(text){
	return text.charAt(0).toUpperCase() + text.slice(1)
});

Vue.filter('stdDate',function(date){
	return moment(date).format('MMMM Do YYYY');
});


Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '3px'
})



Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('display-users', require('./components/Users.vue').default);

Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

Vue.component(
    'not-found',
    require('./components/NotFound.vue').default
);


const app = new Vue({
    el: '#app',
    router,
    data:{
      search:''
    },
    methods:{
      searchit: _.debounce(()=>{
        Fire.$emit('searching');
      },1000)
    }
});
