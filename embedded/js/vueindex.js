const baseUrl = 'http://localhost:5000';

//data from firebase
let data = {
  totalVisited: 540,
  liveVisiting :520,
  totalSigned :40,
}
const mapping = {
  pageVisit: 'totalVisited',
  totalSigned: 'totalSigned',
  liveNowModal: 'liveVisiting'
}
//recent activities data from firebase
let recentActivities = [
  { name: 'Lisa', city: 'California', timeStamp: '' },
  { name: 'Parina', city: 'Texas', timeStamp: ''  },
  { name: 'Sirana', city: 'India' , timeStamp: '' },
  { name: 'Linda', city: 'Cala', timeStamp: '' }
]

// PARENT COMPOENENT
Vue.component('widget', {
  template: `
  <div id='block' :style="positions[customize.appearFrom]">
  <link rel="stylesheet" type="text/css" href="css/index.css"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <transition :name="customize.direction">
      <section id="social_proof" class="custom-social-proof"  v-show="show" :style="positions[customize.appearFrom]" >
        <div class="custom-notification" :style="themes[customize.theme]">
          <VariantModal :customize="customize" v-model="show" @toggle="show = !show"> </VariantModal>
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
      customize: {
        supportedCards: ['pageVisit','recentlyVisited', 'totalSigned', 'liveNowModal'],
        appearFrom: 'bottomRight',
        initialCard: 'totalSigned',
        theme: 'rounded',
        direction: 'bounceBottom', // or 'bounceTop' or 'bounceBottom'
        captureLinks: ['home', 'about', 'signUp'],
        targetLinks: ['signUp'],
        notification: {
          firstDelay: 5000,
          duration: 3000,
          timeGapBetweenEach: 5000,
          transitionTime: 400
        },
        liveNowNotLoop: false, // will show only once
        pageVisitNotLoop: false,
        recentActivityNotLoop: false,
        modalHTML: {
          liveNowModal: {
            image: './images/image1.jpg',
            message: ` people  are visiting this page right now.`,
          },
          pageVisit: {
            image: './images/image6.png',
            message: ` has visited this site.`,
          },
          totalSigned: {
            image: './images/image5.jpg',
            message: ` have signed up this page.`,
          },
          recentlyVisited: {
            image: './images/image6.png',
            message: ` have signed up.`,
          },
        }
      },
    }
  },

  created() {
    axios
      .get(`${baseUrl}/customize?token=def`)
      .then(response => {
        this.customize = response.data
      })
      .catch(error => console.log(error))
  },
  methods: {
    sleep: function(ms) {
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
  props: ['customize'],
  data() {
    return {
      image: this.customize.modalHTML[this.customize.initialCard].image,
      // TODO: Update key names to remove extra mapping variable
      message: data[mapping[this.customize.initialCard]] + this.customize.modalHTML[this.customize.initialCard].message,
      index: 0,
      recentIndex: 0,
      supportedCards: this.customize.supportedCards,
      modalHTML: this.customize.modalHTML,
      onlyOnce: true
    }
  },
  mounted : function() {
    this.setModalShowPattern(this.customize);
  },

  methods: {
    sleep: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    hideModal: function() {
      return new Promise((resolve, reject) => {
        this.$emit("toggle", false)
        this.image = this.modalHTML[this.supportedCards[this.index]].image
        let key = this.supportedCards[this.index]
        switch (key) {
          case 'liveNowModal':
            this.message = this.liveVisiting + this.modalHTML[this.supportedCards[this.index]].message + `<small> ${this.timeStamp || ''}</small>`;
            break;
          case 'totalSigned':
            this.message = this.totalSigned + this.modalHTML[this.supportedCards[this.index]].message + `<small> ${this.timeStamp || ''}</small>`;
            break;
          case 'pageVisit':
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
    },

    showModal: function() {
      new Promise((resolve, reject) => {
        this.$emit("toggle", true)
        if(this.index === (this.supportedCards.length-1) && this.onlyOnce) {
          if(this.customize.liveNowNotLoop)
          this.supportedCards = this.supportedCards.filter(item => item !== 'liveNowModal');
          if(this.customize.pageVisitNotLoop)
          this.supportedCards = this.supportedCards.filter(item => item !== 'pageVisit');
          if(this.customize.recentActivityNotLoop)
          this.supportedCards = this.supportedCards.filter(item => item !== 'recentlyVisited');
          onlyOnce = false;
          this.index = 0;
        }
        resolve();
      })
    },

    setModalShowPattern: function(customize) {
      const safetyBuffer = 200;
      console.log(this.customize)
      const { timeGapBetweenEach, duration, transitionTime } = customize.notification;
      const timeGap = timeGapBetweenEach + duration + (transitionTime * 2 ) + safetyBuffer;
      return new Promise((resolve, reject) => {
        setInterval(function() {
          this.hideModal()
            .then(() => this.sleep(timeGapBetweenEach))
            .then(() => this.showModal(customize))
            .then(() => this.sleep(duration))
        }.bind(this), timeGap);
        resolve();
      });
    }
  },

  computed: {
    name: function() {
      return recentActivities[this.recentIndex].name
    },
    city: function() {
      return recentActivities[this.recentIndex].city
    },
    timeStamp: function() {
      return recentActivities[this.recentIndex].timeStamp
    },
    liveVisiting: function() {
      return data.liveVisiting;
    },
    totalSigned: function() {
      return data.totalSigned;
    },
    totalVisited: function() {
      return data.totalVisited;
    }
  }
})

const attachEventListeners = () => new Promise((resolve, reject) => {
  //get recent data
  window.addEventListener('message', event => {
    try {
      if(typeof event.data !== 'string') {
        return
      }
      let eventData = JSON.parse(event.data);
      if (eventData.type === 'CUSTOMIZABLE_PARAMS') {
        const { totalVisited, liveVisiting, totalSigned } = eventData.value
        recentActivities = Object.values(eventData.value.recentActivities)
        data = { totalVisited, liveVisiting, totalSigned }
        initVueComponent()
      }
    } catch(err) {
      console.log(err)
    }
  })

  // collect form data and pass to firebase
  submitActors = document.getElementsByTagName('form');
  let submitDetails = {}
  submitActors[0].addEventListener('submit', (event) => {
    event.preventDefault();
    for (let i = 1; i < event.currentTarget.length; i++) {
      if(event.currentTarget[i]['name']) {
        submitDetails[event.currentTarget[i]['name']] = event.currentTarget[i]['value'];
      }
    }
    // get ip
    $.get("http://ipinfo.io", function(response) {
      debugger;
      submitDetails['ip'] = response.ip
      submitDetails['city'] = response.city
      submitDetails['country'] = response.country
      submitDetails['loc'] = response.loc

      message = {
        type: 'SUBMIT',
        value: submitDetails
      }
      emitEvent(message)
    }, "jsonp");
  })
  resolve();  
 });

const updateLiveCount = (dbRef) => new Promise((resolve, reject) => {
  emitEvent({
    type: 'PAGE_VISIT',
    value: data.liveVisiting + 1,
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
  resolve();
})

const getQueryParam = (key = 'token') => {
  key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
  var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}


// Executed only once
const initVueComponent = (function() {
  var executed = false;
  return () => new Promise((resolve, reject) => {
    if (executed) {
      return resolve()
    }
    else {
      executed = true;
      appendWidget().then(resolve);  
    }
  });
})();

const token = getQueryParam()
window.onload = attachEventListeners()
                  .then(updateLiveCount)
