const baseUrl = 'http://localhost:3000';
const mapKey = '';
//data from firebase
let firebaseData = {
  totalVisited: 540,
  liveVisiting: 520,
  totalSigned: 40,
}
//recent activities data from firebase
let recentActivities;
// dummy customize object
let customize = {
  supportedCards: ['totalVisited', 'recentActivities', 'totalSigned', 'liveVisiting'],
  appearFrom: 'bottomLeft',
  initialCard: 'totalSigned',
  theme: 'boxy',
  direction: 'bounceBottom', // or 'bounceTop' or 'bounceBottom'
  captureLinks: ['home', 'about', 'signUp'],
  targetLinks: ['signUp'],
  notification: {
    firstDelay: 5000,
    duration: 4000,
    timeGapBetweenEach: 3000,
    transitionTime: 1000
  },
  hotStreak: {
    lastHours: 24,
    minToShow: 2,
    type: 'totalSigned'
  },
  showLastActivities: 20,
  liveNowNotLoop: false, // will show only once
  totalVisitedNotLoop: false,
  recentActivityNotLoop: false,
  totalSignedNotLoop: false,
  modalHTML: [
    {
      label: 'liveVisiting',
      image: './images/image1.jpg',
      message: ` people  are visiting this page right now.`,
    },
    {
      label: 'totalVisited',
      image: './images/image6.png',
      message: ` has visited this site.`,
    },
    {
      label: 'totalSigned',
      image: './images/image3.jpg',
      message: ` have signed up this page.`,
    },
    {
      label: 'recentActivities',
      image: './images/image7.png',
      message: ` have signed up.`,
    }]
}


const positions = {
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
}

const themes = {
  rounded: {
    'border-radius': '50px'
  },
  boxy: {
    'border-radius': '10px'
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

// PARENT COMPOENENT
Vue.component('widget', {
  template: `
  <div id='block' :style="positions[customize.appearFrom]">
  <link rel="stylesheet" type="text/css" href="css/index.css"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <transition appear :name="customize.direction" :duration="customize.notification.transitionTime">
      <section id="social_proof" class="custom-social-proof" v-show="show"  v-if="manyModal" :style="positions[customize.appearFrom]">
        <div class="custom-notification" :style="themes[customize.theme]">
          <VariantModal :customize="customize" :firebaseDataProp="firebaseDataProp" :recentActivitiesProp="recentActivitiesProp" @manyModal="manyModal =false" v-model="show" @toggle="show = !show"> </VariantModal>
          <div class="custom-close" v-on:click="show=!show"><img src='./images/close-icon.png'></div>
        </div>
      </section>
    </transition>
  </div>
 `,
  data() {
    return {
      show: true,
      manyModal: true,
      themes: themes,
      customize: customize,
      positions: positions,
      firebaseDataProp: firebaseData,
      recentActivitiesProp: recentActivities
    }
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
  props: ['customize', 'firebaseDataProp', 'recentActivitiesProp'],
  data() {
    return {
      index: 0,
      recentIndex: 0,
      name: '',
      city: '',
      country: '',
      timestamp: '',
      timeGap: 5000,
      modalHTML: this.customize.modalHTML,
      onlyOnce: true,
      firebaseData: this.firebaseDataProp,
      recentActivities: this.recentActivitiesProp,
      image: this.customize.modalHTML.find(obj => {
        return obj.label === this.customize.initialCard
      }).image,
      message: this.firebaseDataProp[this.customize.initialCard] + this.customize.modalHTML.find(obj => {
        return obj.label === this.customize.initialCard
      }).message + `<small>in the past ${this.hotstreakPastHours || 24} hours</small>`,
      totalVisited: this.firebaseDataProp.totalVisited || '',
      totalSigned: this.firebaseDataProp.totalSigned || '',
      liveVisiting: this.firebaseDataProp.liveVisiting,
      hotstreakPastHours: this.customize.hotStreak.pastHours,
      showHotStreak: this.customize.hotStreak.type,
      supportedCards: this.customize.supportedCards,
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
        this.$emit("toggle", value);
        resolve();
      })
    },

    manageIndex: function () {
      this.index = this.index + 1;
      this.index = this.index === this.supportedCards.length ? 0 : this.index;
    },

    filterCard: function (key) {
      this.supportedCards = this.supportedCards.filter(item => item !== key);
      return;
    },

    setFirebaseData: function () {
      this.firebaseData = firebaseData;
      this.liveVisiting = this.firebaseData.liveVisiting;
      if (this.showHotStreak === 'totalSigned')
        this.firebaseData.totalSigned >= this.customize.hotStreak.minToShow ? (this.totalSigned = this.firebaseData.totalSigned) : this.manageIndex();
      else
        this.firebaseData.totalVisited >= this.customize.hotStreak.minToShow ? (this.totalVisited = this.firebaseData.totalVisited) : this.manageIndex();;
      this.recentActivities = recentActivities || '';
      if (this.recentActivities.length) {
        this.image = this.recentActivities[this.recentIndex].mapUrl;
        this.name = this.recentActivities[this.recentIndex].name || this.recentActivities[this.recentIndex].firstname || this.recentActivities[this.recentIndex].lastname || '';
        this.city = this.recentActivities[this.recentIndex].city || '';
        this.country = this.recentActivities[this.recentIndex].country || '';
        this.timestamp = this.recentActivities[this.recentIndex].timestamp;
      } else if (this.supportedCards[this.index] === 'recentActivities') {
        this.manageIndex();
        if (this.supportedCards.length === 1) this.$emit("manyModal", false);
      }
    },

    timeSince: function (date) {
      var seconds = Math.floor((new Date() - new Date(date)) / 1000);
      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return interval + " years";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return interval + " months";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return interval + " days";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " hours";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    },

    hideModal: function () {
      return new Promise((resolve, reject) => {
        this.toggle(false)
          .then(() => {
            // sleep for time so that modal hide then change its content
            this.sleep(500)
              .then(() => {
                this.setFirebaseData();
                let key = this.supportedCards[this.index];
                let modalIndex = this.modalHTML.find(obj => obj.label === key);
                if (key !== 'recentActivities') this.image = modalIndex.image
                switch (key) {
                  case 'liveVisiting':
                    this.message = this.liveVisiting + modalIndex.message;
                    break;
                  case 'totalSigned':
                    this.message = `<b>${this.totalSigned}</b> ${modalIndex.message}
                       <small>in the past ${this.hotstreakPastHours || 24} hours</small> `;
                    break;
                  case 'totalVisited':
                    this.message = `<b>${this.totalVisited}</b> ${modalIndex.message}
                       <small>in the past ${this.hotstreakPastHours || 24} hours</small> `;
                    break;
                  case 'recentActivities': {
                    this.message = `<b>${this.name || 'Someone'} from ${this.city || ''}</b></br>${modalIndex.message}
                       <small>in the past ${this.timeSince(this.timestamp) || 24}</small> `
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
            filterCard('liveVisiting')

          if (this.customize.totalVisitedNotLoop)
            filterCard('totalVisited')

          if (this.customize.recentActivityNotLoop)
            filterCard('recentActivities')

          if (this.customize.totalSignedNotLoop)
            filterCard('totalSigned')

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
        recentActivities = Object.values(eventData.value.recentActivities || '')
        firebaseData = { totalVisited, liveVisiting, totalSigned }
        initVueComponent()
      }
    } catch (err) {
      console.log(err)
    }
  })

  // collect form data and pass to firebase
  submitActors = document.getElementsByTagName('form');
  let submitDetails = {}
  submitActors[0].addEventListener('submit', (event) => {
    for (let i = 0; i < event.currentTarget.length; i++) {
      if (event.currentTarget[i]['name']) {
        submitDetails[event.currentTarget[i]['name']] = event.currentTarget[i]['value'];
      }
    }
    // get ip
    axios.get("http://ipinfo.io")
      .then(response => {
        submitDetails['ip'] = response.data.ip;
        submitDetails['city'] = response.data.city;
        submitDetails['country'] = response.data.country;
        submitDetails['loc'] = response.data.loc;
        submitDetails['timestamp'] = new Date()
        emitEvent({
          type: 'SUBMIT',
          value: submitDetails
        })
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
          customize = response.data.customization;
          return appendWidget();
        })
        .catch(error => console.log(error));
    }
  });
})();


window.onload = event => attachEventListeners()
  .then(() => updateLiveCount(true))
  .then(() => updateVisitTime(true))

window.onbeforeunload = event => updateLiveCount()

