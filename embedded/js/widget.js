const $body = $('body');
const $submitActors = $body.find('input[type=submit]');
const baseUrl = 'http://localhost:5000';
const widget = document.createElement('section'); // is a node
let contentIndex = 0; //to change content of pop ups
let totalVisited = 0;
let liveVisiting = 0;
let totalSigned = 0;
let timegap = 5000;
let name = 'Lisa';
let city = 'California';
let onlyOnce = true;
let recentIndex = 0;
let customize = {
  supportedCards: ['pageVisit', 'totalSigned', 'liveNowModal', 'recentlyVisited'],
  appearFrom: 'topRight',
  initialCard: 'pageVisit',
  theme: 'boxy',
  showDirection: 'up',
  hideDirection: 'up',
  captureLinks: ['/home/rails/work/embedded/embedded/index.html'],
  targetLinks: ['/home/rails/work/embedded/embedded/index.html'],
  notification: {
    firstDelay: 1000,
    duration: 3000,
    timeGapBetweenEach: 7000
  },
  liveNowNotLoop: true,
  pageVisitNotLoop: true,
  recentActivityNotLoop: true,
  effectOptions: { direction : 'up'},
  modalHTML: {
    liveNowModal: {
      image: './images/image1.jpg',
      setMessage: () => `<b>${liveVisiting}</b> people  are visiting this page right now.`,
    },
    pageVisit: {
      image: './images/image6.png',
      setMessage: () => `<b>${totalVisited}</b> has visited this site.`,
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
        setMessage: () => `<b>${name = 'Parina'} from ${city = 'Texxas'}</b> have signed up.<br><small> 1 hour ago</small>`,
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
    } else {
      getModalHTML(customize.modalHTML[modal]);
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
    'border-radius': '40px'
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
    <link rel="stylesheet" type="text/css" href="css/widget.css"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <div id='block'>
    <section id="social_proof" class="custom-social-proof">
      <div class="custom-notification">
        <div class="custom-notification-container">
          <div class="custom-notification-image-wrapper">
            <img id="modal-image" src="${customize.modalHTML[customize.initialCard].image}">
            <div class="pulse-ring"></div>
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
  if(customize.targetLinks.includes(location.pathname)) {
    setTimeout(function() {
      $body.append(widget);
      applyTheme(customize.theme);
      changePosition(customize.appearFrom);
      timegap = customize.notification.timeGapBetweenEach + customize.notification.duration + 2000;
    }, customize.notification.firstDelay );
  }
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

// const toggleModal = () => new Promise((resolve, reject) => {
//   $(".custom-social-proof").hide(customize.effect, { direction: customize.hideDirection }, 800, function() {
//     contentIndex++;
//     contentIndex = contentIndex === customize.supportedCards.length ? 0 : contentIndex;
//     getInnerHTML(customize.supportedCards[contentIndex])
//     shuffleCounts();
//     sleep(customize.notification.timeGapBetweenEach);
//     $(".custom-social-proof").show(customize.effect, { direction: customize.showDirections}, 800, function() {
//       sleep(customize.notification.duration);
//     });
//   });
//     // $(".custom-social-proof").stop().show('slide', { direction: customize.direction || 'down' })
//     //   function() {
//     //   if ($(this).is(':hidden')) {
//     //     contentIndex++;
//     //     contentIndex = contentIndex === customize.supportedCards.length ? 0 : contentIndex;
//     //     shuffleCounts();
//     //   }
//     // });
// });


const toggleModal = () => new Promise((resolve, reject) => {
  $(".custom-social-proof").hide('slide', { direction: customize.hideDirection }, 800, function() {
    contentIndex++;
    contentIndex = contentIndex === customize.supportedCards.length ? 0 : contentIndex;
    getInnerHTML(customize.supportedCards[contentIndex]);
    shuffleCounts();
    sleep(customize.notification.timeGapBetweenEach);
    $(".custom-social-proof").show('slide', { direction: customize.showDirection } , 800, function() {
      sleep(customize.notification.duration);
    });
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
  });
    // $(".custom-social-proof").stop().show('slide', { direction: customize.direction || 'down' })
    //   function() {
    //   if ($(this).is(':hidden')) {
    //     contentIndex++;
    //     contentIndex = contentIndex === customize.supportedCards.length ? 0 : contentIndex;
    //     shuffleCounts();
    //   }
    // });
});



// bounceBottom-enter-active come from bottom to top
// bounceBottom-leave-active come from top to bottom

// .bounceTop-enter-active from top to up
// bounceTop-leave-active from top to down


// const toggleModal = () => new Promise((resolve, reject) => {
//   $('#block').removeClass('bounceTop-enter-active').addClass('bounceTop-leave-active')
//     .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
//       sleep(customize.notification.timeGapBetweenEach);
//       contentIndex++;
//       shuffleCounts();
//       contentIndex = contentIndex === customize.supportedCards.length ? 0 : contentIndex;
//       getInnerHTML(customize.supportedCards[contentIndex]);

//       $(this).removeClass('bounceBottom-leave-active').addClass('bounceBottom-enter-active');
//       sleep(customize.notification.duration);
//   });
//   // $(".custom-social-proof").addClass("fadeIn-leave-active")
//   // $(".custom-social-proof").hide(customize.effect, { direction: customize.hideDirection }, 800, function() {
// });

$(() => {
  //Gets custom field using token
  getDataUsingToken()
    .then(data => addWidget(data))
  .catch((err) => {
    console.error(`Backend server is off! ${err}`);
    addWidget();
  });


  setInterval(function() {
    toggleModal()
  }, timegap);

  // getInnerHTML(customize.supportedCards[contentIndex])
  //   .then(() => Promise.delay(customize.notification.duration))
  //   .then(() => toggleModal())
  //   .then(() => Promise.delay(customize.notification.timeGapBetweenEach))

  // setInterval(function() {
  //   $(".custom-social-proof").stop().toggle('slide', { direction: customize.direction || 'down' },
  //     function() {
  //     if ($(this).is(':hidden')) {
  //       contentIndex++;
  //       contentIndex = contentIndex === customize.supportedCards.length ? 0 : contentIndex;
  //       // $(".custom-notification-container").delay(customize.notification.duration)
  //       // getInnerHTML(customize.supportedCards[contentIndex])
  //       getInnerHTML(customize.supportedCards[contentIndex])
  //         .then(() => Promise.delay(customize.notification.duration))
  //         .then(() => toggleModal())
  //         .then(() => Promise.delay(customize.notification.timeGapBetweenEach))
  //       //todo: Establish socket connection to update live counts
  //       shuffleCounts();
  //     }
  //   });
  // }, timegap);

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
