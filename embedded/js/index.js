const $body = $('body');
const $submitActors = $body.find('input[type=submit]');
const baseUrl = 'http://localhost:5000';
const widget = document.createElement('section'); // is a node
let contentIndex = 0;
let totalVisited = 0;
let liveVisiting = 0;
let totalSigned = 0; //to change content of pop ups
let customize = {
  supportedCards: ['pageVisit', 'totalSigned', 'liveNowModal'],
  appearFrom: 'bottomRight',
  initialCard: 'pageVisit',
  direction: 'down',
  modalHTML: {
    liveNowModal: {
      image: './images/image1.jpg',
      setMessage: () => `<b>${liveVisiting}</b> people  are visiting this page right now. <br>`,
    },
    pageVisit: {
      image: './images/image2.jpg',
      setMessage: () => `<b>${totalVisited}</b> has visited this site. <br>`,
    },
    totalSigned: {
      image: './images/image5.jpg',
      setMessage: () => `<b>${totalSigned}</b> have signed up this page.</br>`,
    },
  }
}

const getInnerHTML = (modal) => getModalHTML(customize.modalHTML[modal])

const getModalHTML = (customData = {}) => {
  $("#modal-image").attr("src", customData.image)
  $("#modal-content").html(customData.setMessage())
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

const changePosition = (position) => {
  return $('.custom-social-proof').css(positions[position]);
}

const addWidget = (res) => {
  // If we get empty response then we use our default modals
  customize = res || customize;
  widget.innerHTML = `
    <link rel="stylesheet" type="text/css" href="build/css/index.css"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
  `;
  $body.append(widget);
  changePosition(customize.appearFrom);
}

const getDataUsingToken = () => {
  return new Promise((resolve, reject) => {
    return $.ajax({
      dataType: 'json',
      url: `${baseUrl}/customize/defsfsby`,
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
  })
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

$(() => {
  //Gets custom field using token
  getDataUsingToken()
    .then(data => addWidget(data))
  .catch((err) => {
    console.error(`Backend server is off! ${err}`);
    addWidget();
  });

  const shuffleCounts = () => {
    //This is to mock real data, Actual implementation to be done by SOCKET CONNECTION
    liveVisiting = (Math.floor(Math.random() * (20 + 1)));
    totalSigned = (Math.floor(Math.random() * (20 + 1)));
    totalVisited = (Math.floor(Math.random() * (20 + 1)));
  }

  setInterval(function() {
    $(".custom-social-proof").stop().toggle('slide', { direction: customize.direction || 'down' }, function() {
      if ($(this).is(':hidden')) {
        contentIndex++;
        contentIndex = contentIndex === customize.supportedCards.length ? 0 : contentIndex;
        getInnerHTML(customize.supportedCards[contentIndex])
        //todo: Establish socket connection to update live counts
        shuffleCounts()
      }
    });
  }, 2000);

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
