<template>
  <div class="footer">
    <div class="container">
      <div id="row">
        <div class="column" v-for="n in 11">
          <div class="date" @click="goToDate(n+19)">
            <h3>{{ n + 19 }}</h3>
            <p>{{ dayOfWeek(n) }}</p>
          </div>
        </div>
      </div>
      <div id="filter">
        <h3 class="button" @click="show">필터</h3>
        <modal name="filtering" height="500" >
          <div class="modalWrapper">
            <h2>쇼핑사 선택</h2>
            <p><input type="checkbox" value="1" v-model="temp_checkedCompanys">CJ오쇼핑</p>
            <p><input type="checkbox" value="2" v-model="temp_checkedCompanys">GS홈쇼핑</p>
            <p><input type="checkbox" value="3" v-model="temp_checkedCompanys">롯데홈쇼핑</p>
            <p><input type="checkbox" value="4" v-model="temp_checkedCompanys">현대홈쇼핑</p>
            <br />
            <h2>카테고리 선택</h2>
            <p><input type="checkbox" value="1" v-model="temp_checkedCates">생활·주방</p>
            <p><input type="checkbox" value="2" v-model="temp_checkedCates">가전·디지털</p>
            <p><input type="checkbox" value="3" v-model="temp_checkedCates">화장품·미용</p>
            <p><input type="checkbox" value="4" v-model="temp_checkedCates">패션·잡화</p>
            <p><input type="checkbox" value="5" v-model="temp_checkedCates">유아·아동</p>
            <p><input type="checkbox" value="6" v-model="temp_checkedCates">여행·레저</p>
            <p><input type="checkbox" value="7" v-model="temp_checkedCates">식품·건강</p>
            <p><input type="checkbox" value="8" v-model="temp_checkedCates">보험</p>

            <button class="button" type="button" @click="filter">필터 적용</button>
            <button class="button" type="button" @click="cancel">필터 모두 취소</button>
            <button class="button" type="button" @click="hide">닫기</button>
          </div>
        </modal>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-footer',
  data () {
    return {
      week: ['월', '화', '수', '목', '금', '토', '일'],
      companys: ['CJ오쇼핑', 'GS홈쇼핑', '롯데홈쇼핑', '현대홈쇼핑'],
      cates: ['생활·주방', '가전·디지털', '화장품·미용', '패션·잡화', '유아·아동', '여행·레저', '식품·건강', '보험'],

      checkedCompanys: [],
      checkedCates: [],

      temp_checkedCompanys: [],
      temp_checkedCates: [],

      companyListString: '',
      cateListString: ''
    }
  },
  methods: {
    dayOfWeek (n) {
      return this.week[(n - 1) % 7]
    },

    goToDate (day) {
      this.$router.push({
        path: '/date/' + '201711' + String(day)
      })
    },

    show () {
      this.temp_checkedCompanys = this.checkedCompanys
      this.temp_checkedCates = this.checkedCates
      this.$modal.show('filtering')
    },

    hide () {
      this.$modal.hide('filtering')
    },

    filter () {
      if (confirm('필터링을 적용하시겠습니까?')) {
        this.checkedCompanys = this.temp_checkedCompanys
        this.checkedCates = this.temp_checkedCates

        this.companyListString = ''
        this.cateListString = ''

        for (let i = 0; i < this.checkedCompanys.length; i++) {
          this.companyListString += String(this.checkedCompanys[i]) + ','
        }
        this.companyListString = this.companyListString.slice(0, -1)

        this.cateListString = ''
        for (let i = 0; i < this.checkedCates.length; i++) {
          this.cateListString += String(this.checkedCates[i]) + ','
        }
        this.cateListString = this.cateListString.slice(0, -1)

        // let params = this.$route.params
        this.$router.push({
          path: '/query/' + 'companys=' + this.companyListString + '&cates=' + this.cateListString
        })
        this.$modal.hide('filtering')
      }
    },

    cancel () {
      if (this.checkedCompanys.length > 0 || this.checkedCates.length > 0) {
        if (confirm('필터 적용을 취소하시겠습니까?')) {
          this.checkedCompanys = []
          this.checkedCates = []

          this.temp_checkedCompanys = []
          this.temp_checkedCates = []

          this.companyListString = ''
          this.cateListString = ''

          let params = this.$route.params

          if ('date' in params) {
            let date = params.date
            this.$router.push({
              path: '/date/' + date + '/query/' + 'companys=' + this.companyListString + '&cates=' + this.cateListString
            })
          } else {
            this.$router.push({
              path: '/query/' + 'companys=' + this.companyListString + '&cates=' + this.cateListString
            })
          }
          this.$modal.hide('filtering')
          window.scrollTo(0, 0)
        }
      } else {
        alert('적용된 필터가 없습니다.')
      }
    }
  }
}
</script>

<style scoped>
  .footer {
    background-color: #FFFFFF;
    border-top: 1px solid #BDBDBD;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }

  .container {
    max-width: 1024px;
    margin: 0 auto;
  }

  #filter {
    text-align: center;
    float: left;
    margin: 20px auto;
    width: 13%;
  }

  #row {
    float: left;
    border-right: 1px solid #BDBDBD;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px 10px;
    width: 80%;
  }

  .column {
    display: inline-block;
    width: 100px;
    text-align: center;
  }

  .date {
    width: 60px;
    margin: 0 auto;
    cursor: pointer;
    text-decoration: none;
    color: #000000;
  }

  .button {
    background-color: black;
    color: white;
    outline: 0;
    cursor: pointer;
  }

  .modalWrapper {
    width: 100%;
    height: 100%;
    padding: 30px;
  }

  .modalWrapper > .button {
    width: 130px;
    height: 30px;
    margin: 20px;

    font-size: 20px;
  }

</style>
