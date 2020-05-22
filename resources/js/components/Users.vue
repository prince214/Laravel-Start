<template>
    <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">User Table</h3>

                <div class="card-tools">
                    <button class="btn btn-success" @click="newModal">Add New <i class="fas fa-user-plus"></i></button>      
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Created at</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr v-for="user in users" :key="user.id">
                      <td>{{user.id}}</td>
                      <td>{{user.name | upText}}</td>
                      <td>{{user.email}}</td>
                      <td>23 dafa f</td>
                      <td><span class="tag tag-success">{{user.created_at | stdDate}}</span></td>
                      <td>
                          <a href="#" @click="editModal(user)">
                              <i class="fas fa-edit blue"></i>
                          </a>/
                          <a href="#" @click="deleteUser(user.id)">
                              <i class="fas fa-trash red"></i>
                          </a>
                      </td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>


        <!-- Modal -->
        <div class="modal fade" id="addNewCenter" tabindex="-1" role="dialog" aria-labelledby="addNewCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" v-show="!editMode" id="addNewLongTitle">Add New</h5>
                <h5 class="modal-title" v-show="editMode" id="addNewLongTitle">Update User</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

               <form @submit.prevent="editMode ? updateUser() : createUser()">

              <div class="modal-body">

                <div class="form-group">
                  <input v-model="form.name" type="text" name="name"
                  placeholder="Name ..." 
                    class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                  <has-error :form="form" field="name"></has-error>
                </div>

        
                <div class="form-group">
                  <input v-model="form.email" type="text" name="email"
                  placeholder="Email ..." 
                    class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                  <has-error :form="form" field="email"></has-error>
                </div>

                <div class="form-group">
                  <input type="hidden" name="date">
                  <datepicker v-model="form.date" :class="{ 'is-invalid': form.errors.has('date') }" placeholder="Select date" :bootstrap-styling="true" >
                  </datepicker>
                  <has-error :form="form" field="date"></has-error>
                </div>

                <div class="form-group">
                  <input v-model="form.password" type="password" name="password"
                  placeholder="Password ..." 
                    class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                  <has-error :form="form" field="password"></has-error>
                </div>

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                <button v-show="editMode" type="submit" class="btn btn-success">Update</button>
                <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
              </div>
          </form>
            </div>
          </div>
        </div>

    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
    export default {
      name:'Users',
      components:{
        Datepicker
      },
        data(){
            return {
              editMode: false,
                users: {},
                form: new Form({
                    'id': '',
                    'name': '',
                    'email': '',
                    'date': '',
                    'password': ''
                })
            }
        },
        methods:{
          updateUser(){
            this.$Progress.start();
            this.form.put('api/user/'+this.form.id)
            .then(()=>{
              //success
              $('#addNewCenter').modal('hide');
              Swal.fire(
              'Updated!',
              'User has been updated.',
              'success'
              )
              this.$Progress.finish();
              Fire.$emit('AfterCreate');
            })
            .catch(()=>{
              this.$Progress.fail();
            });
          },
          editModal(user){
            this.editMode = true;
            this.form.reset();
            $('#addNewCenter').modal('show')
            this.form.fill(user);
          },
          newModal(){
            this.editMode = false;
            this.form.reset();
            $('#addNewCenter').modal('show')
          },
            deleteUser(id){
                Swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                  //Send Request to server to delete user
                  if(result.value){
                      this.form.delete('api/user/'+id)
                        .then(()=>{
                          Swal.fire(
                            'Deleted!',
                            'User has been deleted.',
                            'success'
                              )
                        Fire.$emit('AfterCreate');
                        })
                        .catch(()=>{
                          Swal.fire(
                            'Failed!',
                            'There was something wrong.',
                            'warning'
                          )
                        });
                    }                  
                })
            },
            createUser(){
                this.$Progress.start();

                this.form.post('api/user')
                .then(()=>{
                    Fire.$emit('AfterCreate');
                    $('#addNewCenter').modal('hide');
                    toast.fire({
                      icon: 'success',
                      title: 'User created successfully'
                    })
                    this.$Progress.finish();
                })
                .catch(()=>{
                    this.$Progress.fail();
                })
                
            },
            loadUser(){
                axios.get("api/user").then(({data})=>{this.users = data.data});
            }
        },
        created() {
            this.loadUser();
            Fire.$on('AfterCreate',() => {
                this.loadUser();
            });
            // setInterval(() => this.loadUser(), 3000);
        }
    }
</script>
