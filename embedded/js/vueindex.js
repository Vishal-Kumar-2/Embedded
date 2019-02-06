const baseUrl = 'http://localhost:3000';

//data from firebase
let data = {
  totalVisited: 540,
  liveVisiting: 520,
  totalSigned: 40,
  hotstreakPastHours: 24,
}

const getQueryParam = (key = 'token') => {
  key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
  const match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

const token = getQueryParam()
const API = {
  getCampaign: `${baseUrl}/campaign/${token}`,
  getHotStreak: `${baseUrl}/campaign/${token}/hotstreak`
}
//recent activities data from firebase
let recentActivities = [
  { name: 'Lisa', city: 'California', timeStamp: '' },
  { name: 'Parina', city: 'Texas', timeStamp: '' },
  { name: 'Sirana', city: 'India', timeStamp: '' },
  { name: 'Linda', city: 'Cala', timeStamp: '' }
]
let appComponent = null;

// PARENT COMPOENENT
Vue.component('widget', {
  template: `
  <div id='block' :style="positions[customize.appearFrom]">
  <link rel="stylesheet" type="text/css" href="css/index.css"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <transition appear :name="customize.direction" :duration="customize.notification.transitionTime">
      <section id="social_proof" class="custom-social-proof" v-show="show" :style="positions[customize.appearFrom]" >
        <div class="custom-notification" :style="themes[customize.theme]">
          <VariantModal :customize="customize" :data="data" v-model="show" @toggle="show = !show"> </VariantModal>
          <div class="custom-close" v-on:click="show=!show"><img src='./images/close-icon.png'></div>
        </div>
      </section>
    </transition>
  </div>
 `,
  data() {
    return {
      show: true,
      positions: {
        topLeft: {
          'top': '20px',
          'left': '20px',
        },
        topRight: {
          'top': '20px',
          'right': '20px',
        },
        bottomRight: {
          'bottom': '20px',
          'right': '20px',
        },
        bottomLeft: {
          'bottom': '20px',
          'left': '20px',
        }
      },
      themes: {
        rounded: {
          'border-radius': '50px'
        },
        boxy: {
          'border-radius': '10px'
        }
      },
      data: data,
      customize: {
        supportedCards: ['totalVisited', 'recentlyVisited', 'totalSigned', 'liveVisiting'],
        appearFrom: 'bottomLeft',
        initialCard: 'totalSigned',
        theme: 'rounded',
        direction: 'bounceBottom', // or 'bounceTop' or 'bounceBottom'
        captureLinks: ['home', 'about', 'signUp'],
        targetLinks: ['signUp'],
        notification: {
          firstDelay: 5000,
          duration: 4000,
          timeGapBetweenEach: 3000,
          transitionTime: 1000
        },
        liveNowNotLoop: false, // will show only once
        totalVisitedNotLoop: false,
        recentActivityNotLoop: false,
        totalSignedNotLoop: false,
        modalHTML: {
          liveVisiting: {
            image: './images/image1.jpg',
            message: ` people  are visiting this page right now.`,
          },
          totalVisited: {
            image: './images/image6.png',
            message: ` has visited this site.`,
          },
          totalSigned: {
            image: './images/image3.jpg',
            message: ` have signed up this page.`,
          },
          recentlyVisited: {
            image: './images/image7.png',
            message: ` have signed up.`,
          },
        }
      },
    }
  },

  created() {
    axios.get(API.getCampaign)
      .then(response => {
        console.log(response, '====================')
        this.customize = response.data.customization
        return axios.get(API.getHotStreak)
      })
      .then((result) => {
        if (result && result.data) {
          console.log(result.data)
          // this.data.totalSigned += result.data;
          result.data.conversion ? (this.data.totalSigned += result.data.conversion) : (this.data.totalVisited += result.data.visits)
          this.data.hotstreakPastHours = result.data.pastHours;
        }
      })
      .catch(error => console.log(error, '=============error'))
  },
  methods: {
    sleep: function (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
  }
})

// CHILD COMPONENT
Vue.component('VariantModal', {
  template: `
    <div class="custom-notification-container">
      <div class="custom-notification-image-wrapper">
        <img id="modal-image" v-bind:src="image">
      </div>
      <div class="custom-notification-content-wrapper">
        <p id="modal-content" class="custom-notification-content" v-html="message">
          {{ message }}
        </p>
        <strong class="verify"><img src='./images/check-circle.png'> verified by Enkode </strong>
      </div>
    </div>`,
  props: ['customize', 'data'],
  data() {
    return {
      image: this.customize.modalHTML[this.customize.initialCard].image,
      message: data[this.customize.initialCard] + this.customize.modalHTML[this.customize.initialCard].message,
      index: 0,
      recentIndex: 0,
      supportedCards: this.customize.supportedCards,
      modalHTML: this.customize.modalHTML,
      onlyOnce: true,
      timeGap: 5000
    }
  },
  mounted: function () {
    this.setModalShowPattern(this.customize);
  },

  methods: {
    sleep: function (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    toggle: function (value) {
      return new Promise(resolve => {
        this.$emit("toggle", value)
        resolve()
      })
    },

    hideModal: function () {
      return new Promise((resolve, reject) => {
        this.toggle(false)
          .then(() => {
            // sleep for time so that modal hide then change its content
            this.sleep(500)
              .then(() => {
                this.image = this.modalHTML[this.supportedCards[this.index]].image
                let key = this.supportedCards[this.index]
                switch (key) {
                  case 'liveVisiting':
                    this.message = this.liveVisiting + this.modalHTML[this.supportedCards[this.index]].message + `<small> ${this.timeStamp || ''}</small>`;
                    break;
                  case 'totalSigned':
                    this.message = this.totalSigned + this.modalHTML[this.supportedCards[this.index]].message +
                      ` <small>in the past ${this.hotstreakPastHours} hours</small> `;
                    break;
                  case 'totalVisited':
                    this.message = this.totalVisited + this.modalHTML[this.supportedCards[this.index]].message + `<small> ${this.timeStamp || ''}</small>`;
                    break;
                  case 'recentlyVisited': {
                    this.message = this.name + ' from ' + this.city + this.modalHTML[this.supportedCards[this.index]].message
                    this.recentIndex = this.recentIndex + 1;
                    this.recentIndex = this.recentIndex === recentActivities.length ? 0 : this.recentIndex;
                    break
                  }
                  default:
                    break;
                }
                this.index = this.index + 1;
                this.index = this.index === this.supportedCards.length ? 0 : this.index;
                resolve();
              })
          })
      })
    },

    showModal: function () {
      new Promise((resolve, reject) => {
        this.toggle(true);
        if (this.index === (this.supportedCards.length - 1) && this.onlyOnce) {
          if (this.customize.liveNowNotLoop)
            this.supportedCards = this.supportedCards.filter(item => item !== 'liveVisiting');
          if (this.customize.totalVisitedNotLoop)
            this.supportedCards = this.supportedCards.filter(item => item !== 'totalVisited');
          if (this.customize.recentActivityNotLoop)
            this.supportedCards = this.supportedCards.filter(item => item !== 'recentlyVisited');
          if (this.customize.totalSignedNotLoop)
            this.supportedCards = this.supportedCards.filter(item => item !== 'recentlyVisited');
          this.onlyOnce = false;
          this.index = 0;
        }
        resolve();
      })
    },

    setModalShowPattern: function (customize) {
      const safetyBuffer = 500;
      const { timeGapBetweenEach, duration, transitionTime } = customize.notification;
      this.timeGap = timeGapBetweenEach + duration + transitionTime + safetyBuffer;
      return new Promise((resolve, reject) => {
        setInterval(function () {
          this.hideModal()
            .then(() => this.sleep(timeGapBetweenEach))
            .then(() => this.showModal(customize))
            .then(() => this.sleep(duration))
        }.bind(this), this.timeGap);
        resolve();
      });
    }
  },

  computed: {
    name: function () {
      return `<b>${recentActivities[this.recentIndex].name || recentActivities[this.recentIndex].lastname || 'Someone'}</b>`
    },
    city: function () {
      return `<b>${recentActivities[this.recentIndex].city}, ${recentActivities[this.recentIndex].country}</b>`
    },
    timeStamp: function () {
      return recentActivities[this.recentIndex].timeStamp
    },
    liveVisiting: function () {
      return `<b>${this.data.liveVisiting}</b>`;
    },
    hotstreakPastHours: function () {
      return `<b>${this.data.hotstreakPastHours}</b>`;
    },
    totalSigned: function () {
      return `<b>${this.data.totalSigned}</b>`
    },
    totalVisited: function () {
      return `<b>${this.data.totalVisited}</b>`;
    }
  }
})

const attachEventListeners = () => new Promise((resolve, reject) => {
  //get recent data
  window.addEventListener('message', event => {
    try {
      if (typeof event.data !== 'string') {
        return
      }
      let eventData = JSON.parse(event.data);
      if (eventData.type === 'CUSTOMIZABLE_PARAMS') {
        const { totalVisited, liveVisiting, totalSigned } = eventData.value
        recentActivities = Object.values(eventData.value.recentActivities)
        data = { totalVisited, liveVisiting, totalSigned }
        initVueComponent()
        appComponent && appComponent.$forceUpdate()
      }
    } catch (err) {
      console.log(err)
    }
  })

  // collect form data and pass to firebase
  submitActors = document.getElementsByTagName('form');
  let submitDetails = {}
  submitActors[0].addEventListener('submit', (event) => {
    for (let i = 1; i < event.currentTarget.length; i++) {
      if (event.currentTarget[i]['name']) {
        submitDetails[event.currentTarget[i]['name']] = event.currentTarget[i]['value'];
      }
    }
    // get ip
    axios
      .get("http://ipinfo.io")
      .then(response => {
        submitDetails['ip'] = response.data.ip
        submitDetails['city'] = response.data.city
        submitDetails['country'] = response.data.country
        submitDetails['loc'] = response.data.loc

        message = {
          type: 'SUBMIT',
          value: submitDetails
        }
        emitEvent(message)
      })
      .catch(error => console.log(error))
  })
  resolve();
});

const updateLiveCount = (increment) => new Promise((resolve, reject) => {
  emitEvent({
    type: increment ? 'PAGE_VISIT' : 'PAGE_LEAVE',
    value: data.liveVisiting,
  })
  resolve();
});

const emitEvent = (message) => {
  let iframe = document.getElementById("enkodeframe");
  let iframeWindow = (iframe.contentWindow || iframe.contentDocument);
  iframeWindow.postMessage(JSON.stringify(message), '*')
}

const appendWidget = (token) => new Promise((resolve, reject) => {
  var e = document.createElement("div")
  e.setAttribute("id", "blockmain");
  document.body.appendChild(e);
  var app = new Vue({
    el: "#blockmain",
    template: `<div id="mainEnkodeDiv">
                  <widget></widget>
                </div>`,
  })
  resolve(app);
})



// Executed only once
const initVueComponent = (function () {
  var executed = false;
  return () => new Promise((resolve, reject) => {
    if (executed) {
      return resolve()
    }
    else {
      executed = true;
      appendWidget().then(app => {
        appComponent = app
        resolve()
      });
    }
  });
})();


window.onload = event => attachEventListeners()
  .then(() => updateLiveCount(true))

window.onbeforeunload = event => updateLiveCount()
