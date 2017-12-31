<template>
  <div class="container" @scroll="handleScroll" ref="con">
    <div class="contents" id="contents">
      <div class="loading" v-if="loading">
        <h1>Loading...</h1>
      </div>
      <div class="section" v-for="(section, sIndex) in dataList">
        <div class="date">
          <h1 v-if="section.tz == 0">{{ section.date }}</h1>
        </div>
        <h2>{{ section.date }}</h2>
        <div class="broadcast" v-for="(broadcasting, bIndex) in checkingHour(section.broadcasting_list)">
          <div class="time" v-if="broadcasting.now">
            <h3>{{ broadcasting.now }}</h3>
          </div>
          <div v-for="(item, index) in orderingItems(broadcasting.item_list)">
            <div class="main-item" v-if="index==0">
              <div class="img">
                <img :src="item.img" />
              </div>
              <div class="info">
                <h3><a :name="item.gid">쇼핑사: {{ broadcasting.genre2 }}</a></h3>
                <h3>시간: {{ broadcasting.start_time }} ~ {{ broadcasting.end_time }}</h3>
                <p>{{ item.name }}</p>
                <p>{{ item.price }}원</p>
              </div>
            </div>
            <div class="sub-item" v-else>
              <div class="img">
                <img :src="item.img" />
              </div>
              <div class="info">
                <p>{{ item.name }}</p>
                <p>{{ item.price }}원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      dataList: [],
      todaySection: {
        'date': 20171125,
        'tz': 3
      },
      currentSection: {
        'date': 20171125,
        'tz': 3
      },
      currentQuery: '',

      loading: false, // for message of "loading..." on top
      topSection: {
        'date': 20171125,
        'tz': 2
      },
      bottomSection: {
        'date': 20171125,
        'tz': 4
      },
      exTopTrigger: true,
      exBottomTrigger: true,
      topSectionApiTrigger: false,
      bottomSectionApiTrigger: false,

      bottomLine: 2000
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)

    this.topSection = this.getFrontSection(this.currentSection)
    this.bottomSection = this.getRearSection(this.currentSection)

    this.$http.get(this.$API_SERVER + this.getRequestUrl(this.currentSection))
    .then(response => {
      this.dataList = response.data
    })
    .catch(e => {
      console.log(e)
      alert('오류닷!!')
      this.$router.go()
    })
  },

  beforeDestroy () {
  },

  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },

  mounted () {
  },

  updated () {
    let ClientHeight = document.getElementById('contents').clientHeight
    let InnerHeight = window.innerHeight

    this.exTopTrigger = !this.topSectionApiTrigger
    this.exBottomTrigger = !this.bottomSectionApiTrigger

    if (ClientHeight < InnerHeight) {
      this.topSectionApiTrigger = !this.topSectionApiTrigger
      this.bottomSectionApiTrigger = !this.bottomSectionApiTrigger
    }
  },

  watch: {
    topSectionApiTrigger () {
      console.log('topSectionApiTrigger 시작~')
      this.$http.get(this.$API_SERVER + this.getRequestUrl(this.topSection, this.currentQuery))
      .then(response => {
        this.loading = false

        if (response.data.length === 0) {
          while (true) {
            this.topSection = this.getFrontSection(this.topSection)
            if (!this.isValidSection(this.topSection)) {
              // alert('상품이 없습니다')
              return 0
            }

            let ob = JSON.parse(this.requestHttp(this.topSection, this.currentQuery))
            if (ob.length !== 0) {
              if (ob[0].broadcasting_list.length !== 0) {
                this.dataList.unshift(ob[0])
                this.exTopTrigger = !this.exTopTrigger
                this.topSection = this.getFrontSection(this.topSection)
                return 0
              }
            }
          }
        }
        this.exTopTrigger = !this.exTopTrigger
        if (response.data) {
          this.dataList.unshift(response.data[0])
          this.topSection = this.getFrontSection(this.topSection)
        }
      })
      .catch(e => {
        this.loading = false
        console.log(e)
        this.$router.go()
        // this.exTopTrigger = !this.exTopTrigger
      })
    },

    bottomSectionApiTrigger () {
      console.log('bottomSectionApiTrigger 시작~')
      this.$http.get(this.$API_SERVER + this.getRequestUrl(this.bottomSection, this.currentQuery))
      .then(response => {
        if (response.data.length === 0) {
          while (true) {
            this.bottomSection = this.getRearSection(this.bottomSection)
            if (!this.isValidSection(this.bottomSection)) {
              // this.bottomLine = -1
              return 0
            }

            let ob = JSON.parse(this.requestHttp(this.bottomSection, this.currentQuery))
            if (ob.length !== 0) {
              if (ob[0].broadcasting_list.length !== 0) {
                this.dataList.push(ob[0])
                this.exBottomTrigger = !this.exBottomTrigger
                this.bottomSection = this.getRearSection(this.bottomSection)
                return 0
              }
            }
          }
        }
        this.exBottomTrigger = !this.exBottomTrigger
        if (response.data) {
          this.dataList.push(response.data[0])
          this.bottomSection = this.getRearSection(this.bottomSection)
        }
      })
      .catch(e => {
        console.log(e)
        this.$router.go()
      })
    },

    '$route' (to, from) {
      this.exTopTrigger = !this.topSectionApiTrigger
      this.exBottomTrigger = !this.bottomSectionApiTrigger
      this.bottomLine = 2000

      let params = to.params

      if ('query' in params) {
        this.currentQuery = params.query

        this.$http.get(this.$API_SERVER + this.getRequestUrl(this.todaySection, this.currentQuery))
        .then(response => {
          this.dataList = []
          this.dataList = response.data

          // 스크롤 위치 조정하자....
          // window.scrollTo(0, 1)

          this.currentSection = this.todaySection
          this.topSection = this.getFrontSection(this.todaySection)
          this.bottomSection = this.getRearSection(this.todaySection)
        })
        .catch(e => {
          console.log(e)
          this.$router.go()
        })
      } else if ('date' in params) {
        this.currentSection['date'] = to.params['date']
        this.currentSection['tz'] = 0

        this.topSection = this.getFrontSection(this.currentSection)
        this.bottomSection = this.getRearSection(this.currentSection)

        this.$http.get(this.$API_SERVER + this.getRequestUrl(this.currentSection, this.currentQuery))
        .then(response => {
          this.dataList = []
          this.dataList = response.data
          window.scrollTo(0, 1)
        })
        .catch(e => {
          console.log(e)
          this.$router.go()
        })
      }
    }
  },

  methods: {
    requestHttp (section, currentQuery) {
      var request = new XMLHttpRequest()
      request.open('GET', this.$API_SERVER + this.getRequestUrl(section, currentQuery), false)  // `false` makes the request synchronous
      request.send(null)
      if (request.status === 200) {
        return request.responseText
      }
    },

    compare (a, b) {
      return a.discount_rate - b.discount_rate
    },

    orderingItems (items) {
      return items.slice().sort(this.compare)
    },

    // 지금은 모든 data에 대해서 html rendering시에 계산하지만, 이후에는 스크롤 이벤트에 따라서 유저가 보고있는 data에 한정해서 호출하기?
    checkingHour (brList) {
      let currentHour = -1
      for (let i = 0; i < brList.length; i++) {
        let hour = parseInt(Number(brList[i].start_time) / 100)
        if (hour !== currentHour) {
          if (hour === 0) {
            brList[i]['now'] = '오전 12시'
          } else if (hour > 0 && hour < 12) {
            brList[i]['now'] = '오전 ' + String(hour % 12) + '시'
          } else if (hour === 12) {
            brList[i]['now'] = '오후 12시'
          } else {
            brList[i]['now'] = '오후 ' + String(hour % 12) + '시'
          }
          currentHour = hour
        }
      }
      return brList
    },

    getFrontSection (section) {
      let frontSection = {}
      if (section['tz'] !== 0) {
        frontSection['date'] = section['date']
        frontSection['tz'] = section['tz'] - 1
      } else {
        frontSection['date'] = Number(section['date']) - 1
        frontSection['tz'] = 5
      }
      return frontSection
    },

    getRearSection (section) {
      let rearSection = {}
      if (section['tz'] !== 5) {
        rearSection['date'] = section['date']
        rearSection['tz'] = section['tz'] + 1
      } else {
        rearSection['date'] = Number(section['date']) + 1
        rearSection['tz'] = 0
      }
      return rearSection
    },

    getRequestUrl (section, query) {
      if (section && query) {
        return 'api/v1.0/date/' + section['date'] + '/schedule?tz=' + section['tz'] + '&' + query
      } else {
        return 'api/v1.0/date/' + section['date'] + '/schedule?tz=' + section['tz']
      }
    },

    handleScroll (e) {
      let currentScrollPosition = e.srcElement.scrollingElement.scrollTop
      let scrollHeight = e.srcElement.scrollingElement.scrollHeight

      if (currentScrollPosition === 0) {
        if (!this.isValidSection(this.topSection)) {
          alert('상품이 없습니다.')
          return 0
        } else if (this.topSectionApiTrigger !== this.exTopTrigger) {
          this.loading = true
          this.topSectionApiTrigger = !this.topSectionApiTrigger
        }
      } else if (scrollHeight - currentScrollPosition < this.bottomLine) {
        if (this.bottomSectionApiTrigger !== this.exBottomTrigger) {
          this.bottomSectionApiTrigger = !this.bottomSectionApiTrigger
        }
      }
    },

    isValidSection (section) {
      if (section.date >= 20171120 && section.date <= 20171130) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    margin: 58px 0;
    padding: 30px 0;
    background-color: #EAEAEA;
  }

  .contents {
    max-width: 1024px;
    min-width: 450px;
    margin: auto;
    border-left: 1px solid black;
    border-right: 1px solid black;
  }

  .loading {
    width: 100%;
    text-align: center;
    color: #8C8C8C;
  }

  .date {
    width: 100%;
    text-align: center;
  }

  .broadcast {
    background-color: #FFFFFF;
    margin: 70px 30px;
    position: relative;
  }

  .time {
    width: 100%;
    height: 30px;
    text-align: center;
    position: absolute;
    top: -40px;
    font-size: 22px;
  }

  .main-item {
    height: 150px;
    min-width: 962px;
  }

  .main-item > .img {
    float: left;
    width: 150px;
  }

  .main-item > .img > img {
    width: 100%;
    max-height: 150px;
  }

  .main-item > .info {
    float: left;
    margin: 5px;
  }

  .sub-item {
    height: 100px;
    min-width: 962px;
    margin: 20px 0;
    border-top: 1px solid #8C8C8C;
  }

  .sub-item > .img {
    float: left;
    width: 100px;
  }

  .sub-item > .img > img {
    width: 100%;
    max-height: 100px;
  }

  .sub-item > .info {
    float: left;
    margin: 5px;
  }

</style>
