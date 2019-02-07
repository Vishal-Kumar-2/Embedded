const baseUrl = 'http://localhost:3000';

//data from firebase
let firebaseData = {
  totalVisited: 540,
  liveVisiting: 520,
  totalSigned: 40,
  hotstreakPastHours: 24,
}

let customize = {
  supportedCards: ['totalVisited', 'recentActivities', 'totalSigned', 'liveVisiting'],
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
  showLastActivities: 20,
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
    recentActivities: {
      image: './images/image7.png',
      message: ` have signed up.`,
    },
  }
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
  { name: 'Lisa', city: 'California', timestamp: '' },
  { name: 'Parina', city: 'Texas', timestamp: '' },
  { name: 'Sirana', city: 'India', timestamp: '' },
  { name: 'Linda', city: 'Cala', timestamp: '' }
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
          <VariantModal :customize="customize" :firebaseData="firebaseData" :recentActivities="recentActivities" v-model="show" @toggle="show = !show"> </VariantModal>
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
      firebaseData: firebaseData,
      customize: customize,
      recentActivities: recentActivities
    }
  },
  watch: {
    firebaseData: function () {
      this.firebaseData = firebaseData;
    }
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
  props: ['customize', 'firebaseData', 'recentActivities'],
  data() {
    return {
      index: 0,
      recentIndex: 0,
      supportedCards: this.customize.supportedCards,
      modalHTML: this.customize.modalHTML,
      onlyOnce: true,
      timeGap: 5000,
      image: this.customize.modalHTML.find(obj => {
        return obj.label === this.customize.initialCard
      }).image,
      message: this.firebaseData[this.customize.initialCard] + this.customize.modalHTML.find(obj => {
        return obj.label === this.customize.initialCard
      }).message,
      totalVisited: this.firebaseData.totalVisited,
      liveVisiting: this.firebaseData.liveVisiting,
      totalSigned: this.firebaseData.totalSigned,
      hotstreakPastHours: this.firebaseData.hotstreakPastHours,
      name: this.recentActivities[0].name,
      city: this.recentActivities[0].city,
      timestamp: this.recentActivities[0].timestamp
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

    setFirebaseData: function () {
      this.firebaseData = firebaseData;
      this.liveVisiting = this.firebaseData.liveVisiting
      this.hotstreakPastHours = this.firebaseData.hotstreakPastHours
      this.totalSigned = this.firebaseData.totalSigned
      this.totalVisited = this.firebaseData.totalVisited
      this.recentActivities = recentActivities
      this.name = this.recentActivities[this.recentIndex].name
      this.city = this.recentActivities[this.recentIndex].city
      this.timestamp = this.recentActivities[this.recentIndex].timestamp

    },

    hideModal: function () {
      return new Promise((resolve, reject) => {
        this.toggle(false)
          .then(() => {
            // sleep for time so that modal hide then change its content
            this.sleep(500)
              .then(() => {
                this.setFirebaseData();
                let key = this.supportedCards[this.index]
                let modalIndex = this.modalHTML.find(obj => {
                  return obj.label === key
                })
                this.image = modalIndex.image
                switch (key) {
                  case 'liveVisiting':
                    this.message = this.liveVisiting + modalIndex.message + `<small> ${this.timestamp || ''}</small>`;
                    break;
                  case 'totalSigned':
                    this.message = this.totalSigned + modalIndex.message +
                      ` <small>in the past ${this.hotstreakPastHours || 24} hours</small> `;
                    break;
                  case 'totalVisited':
                    this.message = this.totalVisited + modalIndex.message +
                      ` <small>in the past ${this.hotstreakPastHours || 24} hours</small> `;
                    break;
                  case 'recentActivities': {
                    this.message = this.name + ' from ' + this.city + modalIndex.message + `<small> ${this.timestamp || ''}</small>`
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
            this.supportedCards = this.supportedCards.filter(item => item !== 'recentActivities');
          if (this.customize.totalSignedNotLoop)
            this.supportedCards = this.supportedCards.filter(item => item !== 'totalSigned');
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

    // name: function () {
    //   return `<b>${recentActivities[this.recentIndex].name || recentActivities[this.recentIndex].lastname || 'Someone'}</b>`
    // },
    // city: function () {
    //   return `<b>${recentActivities[this.recentIndex].city}, ${recentActivities[this.recentIndex].country}</b>`
    // },
    // timestamp: function () {
    //   return recentActivities[this.recentIndex].timestamp
    // },
    // liveVisiting: function () {
    //   return `<b>${this.firebaseData.liveVisiting}</b>`;
    // },
    // hotstreakPastHours: function () {
    //   return `<b>${this.firebaseData.hotstreakPastHours}</b>`;
    // },
    // totalSigned: function () {
    //   return `<b>${this.firebaseData.totalSigned}</b>`
    // },
    // totalVisited: function () {
    //   return `<b>${this.firebaseData.totalVisited}</b>`;
    // }
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
        firebaseData = { totalVisited, liveVisiting, totalSigned }
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
    value: firebaseData.liveVisiting,
  })
  resolve();
});

const updateVisitTime = (increment) => new Promise((resolve, reject) => {
  emitEvent({
    type: 'VISIT_TIME',
    value: { timestamp: new Date() },
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
      axios.get(API.getCampaign)
        .then(response => {
          customize = response.data.customization
          return appendWidget();
        })
        .then(app => {
          appComponent = app
          resolve()
        })
        .catch(error => console.log(error))
    }
  });
})();


window.onload = event => attachEventListeners()
  .then(() => updateLiveCount(true))
  .then(() => updateVisitTime(true))

window.onbeforeunload = event => updateLiveCount()
