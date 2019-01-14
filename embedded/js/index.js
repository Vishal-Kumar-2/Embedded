const $body = $('body');
const $submitActors = $body.find('input[type=submit]');
const baseUrl = 'http://localhost:5000';
const widget = document.createElement('section'); // is a node
let contentIndex = 0; //to change content of pop ups
let totalVisited = 0;
let liveVisiting = 0;
let totalSigned = 0;
let onlyOnce = true;
let recentIndex = 0; //alternate recent activities pop-ups
let customize = {
  supportedCards: ['pageVisit','recentlyVisited', 'totalSigned', 'liveNowModal'],
  appearFrom: 'topRight',
  initialCard: 'pageVisit',
  theme: 'rounded',
  showDirection: 'up',
  hideDirection: 'up',
  captureLinks: ['home', 'about', 'signUp'],
  targetLinks: ['signUp'],
  notification: {
    firstDelay: 1000,
    duration: 3000,
    timeGapBetweenEach: 1000,
    transitionTime: 400
  },
  liveNowNotLoop: false,
  pageVisitNotLoop: true, // will show only once
  recentActivityNotLoop: false,
  effectOptions: { direction : 'up' },
  modalHTML: {
    liveNowModal: {
      image: './images/image1.jpg',
      setMessage: () => `<b>${liveVisiting}</b> people  are visiting this page right now.`,
    },
    pageVisit: {
      image: './images/image6.png',
      setMessage: () => `<b>${totalVisited}</b> has visited this site.<br><small>in the last 7 days</small>`,
    },
    totalSigned: {
      image: './images/image5.jpg',
      setMessage: () => `<b>${totalSigned}</b> have signed up this page.<br><small> 1 hour ago</small>`,
    },
    recentlyVisited: [
      {
        image: './images/image6.png',
        setMessage: () => `<b>${name ='Lisa'} from ${city= 'California'}</b> have signed up.<br><small> 1 hour ago</small>`,
      },
      {
        image: './images/image6.png',
        setMessage: () => `<b>${name = 'Parina'} from ${city = 'Texas'}</b> have signed up.<br><small> 1 hour ago</small>`,
      },
      {
        image: './images/image6.png',
        setMessage: () => `<b>${name = 'Sirana'} from ${city = 'India'}</b> have signed up.<br><small> 1 hour ago</small>`,
      },
      {
        image: './images/image6.png',
        setMessage: () => `<b>${name = 'Linda'} from ${city = 'Coimbatore'}</b> have signed up.<br><small> 1 hour ago</small>`,
      }
    ]
  }
}

const getInnerHTML = (modal) => {
  return new Promise((resolve, reject) => {
    if(customize.modalHTML[modal] instanceof Array) {
      recentIndex = recentIndex === customize.modalHTML[modal].length ? 0 : recentIndex;
      getModalHTML(customize.modalHTML[modal][recentIndex])
      recentIndex++;
      resolve();
    } else {
      getModalHTML(customize.modalHTML[modal]);
      resolve();
    }
  })
}

const getModalHTML = (customData = {}) => {
  $("#modal-image").attr("src", customData.image);
  $("#modal-content").html(customData.setMessage());
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

const changePosition = (position) => {
  return $('.custom-social-proof').css(positions[position]);
}

const applyTheme = (theme) => {
  return $('.custom-notification').css(themes[theme]);
}

const addWidget = (res) => {
  // If we get empty response then we use our default modals
  customize = res || customize;
  widget.innerHTML = `
    <link rel="stylesheet" type="text/css" href="css/index.css"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <div id='block'>
    <section id="social_proof" class="custom-social-proof">
      <div class="custom-notification">
        <div class="custom-notification-container">
          <div class="custom-notification-image-wrapper">
            <img id="modal-image" src="${customize.modalHTML[customize.initialCard].image}">
          </div>
          <div class="custom-notification-content-wrapper">
            <p id="modal-content" class="custom-notification-content">
              ${customize.modalHTML[customize.initialCard].setMessage()}
            </p>
            <strong class="verify"><img src='./images/check-circle.png'> verified by Enkode </strong>
          </div>
        </div>
        <div class="custom-close"><img src='./images/close-icon.png'>
        </div>
      </div>
    </section>
    </div>
  `;
  // if(customize.targetLinks.includes(location.pathname)) {
    setTimeout(function() {
      $body.append(widget);
      applyTheme(customize.theme);
      changePosition(customize.appearFrom);
      setModalShowPattern(customize.notification);
    }, customize.notification.firstDelay );
  // }
}

const getDataUsingToken = () => {
  return new Promise((resolve, reject) => {
    return $.ajax({
      dataType: 'json',
      url: `${baseUrl}/customize?token=def`,
      crossDomain: true,
      success: (data) => resolve(data),
      error: reject,
    });
  });
}

const recordTotalVisitCount = () => {
  return new Promise((resolve, reject) => {
    // TODO: fire API call to update total visit when backend ready
    // $.ajax({
    //   type: 'POST',
    //   url: `${baseUrl}/totalVisits`,
    //   crossDomain: true,
    //   data : record unique IP addressess using req.ip at backend
    //   var ip = req.headers['x-forwarded-for'] ||
    //            req.connection.remoteAddress ||
    //            req.socket.remoteAddress ||
    //            (req.connection.socket ? req.connection.socket.remoteAddress : null);
    //   success: (count) => resolve(count)
    //   }
    // })
    // Mocking updated total visit users count
    return resolve(67);
  });
}

const updateSubmitAction = () => {
  return new Promise((resolve, reject) => {
    // TODO: fire API call to update action when backend ready
    // $.ajax({
      //  type: 'POST',
      //  url: `${baseUrl}/submits`,
      //  data:
      //  crossDomain: true,
      //  success:
      //  }
      //})
      // Mocking updated submit count
    return resolve(totalSigned);
  });
}

const shuffleCounts = () => {
  //This is to mock real data, Actual implementation to be done by SOCKET CONNECTION
  liveVisiting = (Math.floor(Math.random() * (20 + 1)));
  totalSigned = (Math.floor(Math.random() * (20 + 1)));
  totalVisited = (Math.floor(Math.random() * (20 + 1)));
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const hideModal = (transitionTime) => new Promise((resolve, reject) => {
  $(".custom-social-proof").hide('slide', { direction: customize.hideDirection }, transitionTime, function() {
    contentIndex++;
    contentIndex = contentIndex === customize.supportedCards.length ? 0 : contentIndex;
    getInnerHTML(customize.supportedCards[contentIndex]);
    resolve();
  });
});

const showModal = (transitionTime) => new Promise((resolve, reject) => {
  $(".custom-social-proof").show('slide', { direction: customize.showDirection } , transitionTime)
  if(contentIndex === (customize.supportedCards.length-1)  && onlyOnce) {
    if(customize.liveNowNotLoop)
      customize.supportedCards = customize.supportedCards.filter(item => item !== 'liveNowModal');
    if(customize.pageVisitNotLoop)
      customize.supportedCards = customize.supportedCards.filter(item => item !== 'pageVisit');
    if(customize.recentActivityNotLoop)
      customize.supportedCards = customize.supportedCards.filter(item => item !== 'recentlyVisited');
    onlyOnce = false;
    contentIndex = 0;
  }
  resolve();
});

const setModalShowPattern = (notificationData = {}) => {
  const safetyBuffer = 200;
  const { timeGapBetweenEach, duration, transitionTime } = notificationData;
  const timeGap = timeGapBetweenEach + duration + (transitionTime * 2 ) + safetyBuffer;
  return new Promise((resolve, reject) => {
    setInterval(function() {
      hideModal(transitionTime)
        .then(() => sleep(timeGapBetweenEach))
        .then(() => showModal(transitionTime))
        .then(() => sleep(duration))
    }, timeGap);
    resolve();
  });
}

$(() => {
  //Gets custom field using token
  getDataUsingToken()
    .then(data => addWidget(data))
  .catch((err) => {
    console.error(`Backend server is off! ${err}`);
    addWidget();
  });

  $(".custom-close").click(() => {
    $(".custom-social-proof").stop().slideToggle('slow');
  });

  $submitActors.click((event) => {
    event.preventDefault();
    updateSubmitAction()
      .then(updatedTotalSigned => {
        totalSigned = updatedTotalSigned;
      })
      .catch((err) => console.error(`Backend server is off! ${err}`))
  });

  $( window ).on( "load", function() {
    recordTotalVisitCount()
    .then(updatedTotalVisited => {
      totalVisited = updatedTotalVisited;
      //Update DOM
    })
    .catch(err => {
      console.error(`Backend server is off! ${err}`);
      addWidget();
    });
  });
});
