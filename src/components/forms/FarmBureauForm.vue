<template>  
  <div class="fb-form-container">
    <div class="form-header">
      <div class="uw-logo-container">
        <img src="../../assets/logos/logo_minimal.png" width="250">
      </div>
      <div class="close-form" @click="closeForm">
        <i class="fas fa-times text-4xl"></i>
      </div>
    </div>
    <div class="fb-form-content">
      <img class="fb-image" src="../../../src/assets/logos/Farm_Bureau_Ad.png"/>
      <h2 class="font-primary uppercase tracking-widest pt-2 sm:text-center text-left">Helping You Is What We Do Best!</h2>
      <h2 class="font-primary uppercase tracking-widest pt-2 sm:text-center text-left">In addition to Home, Auto, Life and Health Insurance, we offer commercial, Farm, Crop and personal liability policies, as well as banking products.  
</h2>
      <form class="fb-form">
        <table class="fb-form-table">
          <tr>
            <th>
              <label for="name">Name: </label>
            </th>
            <td>
              <input v-model="form.name" type="text" name="name">
            </td>
          </tr>
          <tr>
            <th>
              <label for="phone">Phone: </label>
            </th>
            <td>
              <input v-model="form.phone" @input="formatPhoneNumber" type="tel" name="phone">
            </td>
          </tr>
          <tr>
            <th>
              <label for="email">Email: </label>
            </th>
            <td>
              <input v-model="form.email" type="email" name="email">
            </td>
          </tr>
          <tr>
            <th>
              <label for="address">Address: </label>
            </th>
            <td>
              <input v-model="form.address" type="text" name="address">
            </td>
          </tr>
          <tr>
            <th>
              <label for="zip">Zip-code: </label>
            </th>
            <td>
              <input v-model="form.zip" type="text" name="zip">
            </td>
          </tr>
        </table>
      </form>
      <button @click="submitLeadForm()" class="fb-submit">Submit</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: 'FarmBureauForm',

  data: function() {
    return {
      form: {
        name: '',
        address: '',
        zip: '',
        phone: '',
        email: ''
      }
    }
  },
  methods: {
    closeForm() {
      this.$emit('closeForm', '')
    },

    formatPhoneNumber() {
      var formatted_number = this.form.phone.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.form.phone = !formatted_number[2] ? formatted_number[1] : '(' + formatted_number[1] + ')'
        + formatted_number[2] + (formatted_number[3] ? '-' + formatted_number[3] : '');
    },

    submitLeadForm() {
      let url = 'send-lead-message/'
      axios.post(url, this.form).then(() => {
        this.clearFields()
        this.$emit('closeForm', '')
      })
    },

    clearFields() {
      this.form.name = null;
      this.form.address = null;
      this.form.zip = null;
      this.form.phone = null;
      this.form.email = null;
    }
  }
}


</script>

<style lang="scss">
.fb-form-container{
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  height: 100%;
  background-color: #FFFFFF;
  z-index: 9999;
  .form-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    .close-form {
      cursor: pointer;
      color: #7c2b31;
      padding-right: 15px
    }
  }
  .fb-form-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    position: relative;
    overflow-y: auto;
    padding: 20px;
    h2 {
      font-family: 'Baloo 2';
      font-size: 18px;
    }
    .fb-image {
      width: 30%;
    }
    .fb-form {
      width: 75%;
      padding: 10px;
      @media(max-width:800px) {
        width: 100%;
      }
      .fb-form-table {
        border-collapse: separate;
        border-spacing: 0 15px;
        width: 100%;
        th {
          text-align: right;
          @media(max-width:800px) {
            width: 10%;
          }
        }
        td {
          padding-left: 5px;
          @media(max-width:800px) {
            padding-right: 15px;
          }
        }
      }
      input {
        width: 100%;
        border-style: solid;
        border-width: 1px;
      }
    }
    .fb-submit {
      background-color: #7c2b31;
      color: #FFFFFF;
      font-family: Montserrat;
      font-weight: bold;
      padding: 10px;
      border-radius: 10px;
      width: 150px;
      margin-bottom: 5px;
    }
  }
}
</style>