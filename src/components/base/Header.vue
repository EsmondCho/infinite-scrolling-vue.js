<template>
  <div class="header">
    <div class="container">
      <table>
        <tr>
          <td>
            <input type="checkbox" id="trigger" />
            <label class="hamburger" for="trigger"><img id="hamburger" src="../../assets/hamburger.png" /></label>
          </td>
          <td>
            <h1 id="logo">로고</h1>
          </td>
          <td width="70%">
            <input id="search" type="text" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-header'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    background-color: #FF5E00;
    color: #FFFFFF;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }

  .container {
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 16px;
  }

  table {
    text-align: center;
    width: 100%;
    padding: 0;
  }

  #trigger {
    display: none;
  }

  #hamburger {
    width: 30px;
    margin: 15px 0 10px 0;
  }

  #logo {
    margin: 0;
    font-weight: 400;
  }

  #search {
    width: 95%;
    height: 30px;
    font-size: 25px;
  }

  @media screen and (max-width: 425px) {
    #search {
      display: none;
    }

    #logo {
      min-width: 200px;
    }
  }

  #search:focus {
    outline: 0;
  }

</style>
