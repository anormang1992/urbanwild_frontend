<template>  
  <div class="fb-form-container">
    <div class="close-form" @click="closeForm">
      <i class="fas fa-times text-4xl"></i>
    </div>
    <div class="fb-form-content">
      <img class="fb-image" src="../../../src/assets/logos/Farm_Bureau_Ad.png"/>
      <h2 class="text-xl font-primary uppercase tracking-widest pt-2">Helping You Is What We Do Best!</h2>
      <form class="fb-form">
        <table class="fb-form-table">
          <tr>
            <th>
              <label for="name">Name: </label>
            </th>
            <td>
              <input type="text" name="name">
            </td>
          </tr>
          <tr>
            <th>
              <label for="address">Address: </label>
            </th>
            <td>
              <input type="text" name="address">
            </td>
          </tr>
          <tr>
            <th>
              <label for="zip">Zip-code: </label>
            </th>
            <td>
              <input type="text" name="zip">
            </td>
          </tr>
          <tr>
            <th>
              <label for="phone">Phone: </label>
            </th>
            <td>
              <input type="text" name="phone">
            </td>
          </tr>
          <tr>
            <th>
              <label for="email">Email: </label>
            </th>
            <td>
              <input type="text" name="email">
            </td>
          </tr>
        </table>
      </form>
      <button class="fb-submit">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FarmBureauForm',

  data: function() {
    return {

    }
  },
  methods: {
    closeForm() {
      this.$emit('closeForm', '')
    }
  }
}


</script>

<style lang="scss">
.fb-form-container{
  display: flex;
  width:100%;
  height: 100%;
  position: absolute;
  align-content: center;
  background-color: #FFFFFF;
  top: 0;
  z-index: 9999;
  padding: 15px;
  .close-form {
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 25px;
    color: #7c2b31;
    z-index: 99999;
  }
  .fb-form-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: center;
    position: relative;
    .fb-image {
      width: 25%;
    }
    .fb-form {
      width: 50%;
      .fb-form-table {
        border-collapse: separate;
        border-spacing: 0 15px;
        width: 100%;
        th {
          text-align: right;
        }
        td {
          padding-left: 5px;
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
    }
  }
}
</style>