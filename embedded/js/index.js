var z = document.createElement('innerHTML'); // is a node
z.innerHTML = `
  <link rel="stylesheet" type="text/css" href="css/index.css"/>
  <section class="custom-social-proof" >
    <div class="custom-notification">
      ${getInnerHTML().live_now_modal}
      <div class="custom-close"> <i class="fa-fa-close"></i></div>
    </div>
  </section>
`;

$(function() {
  let $form = $('body');
  $form.append(z);
  setInterval(function() {

    $(".custom-social-proof").stop().slideToggle('slow', function() {
      $( "p.custom-notification-content" ).html(showAlternate());
    });
    }, 3000);
    $(".custom-close").click(function() {
      $(".custom-social-proof").stop().slideToggle('slow');
    });
    let count = 0;

    let $submitActors = $form.find('input[type=submit]');
    let capture_links = ['/home/rails/work/embedded/embedded/example.html'];
    let target_links = ['/home/rails/work/embedded/embedded/example.html']

    // $form.submit(function(event) {
    //   if (null === submitActor) {
    //     // If no actor is explicitly clicked, the browser will
    //     // automatically choose the first in source-order
    //     // so we do the same here
    //     submitActor = $submitActors[0];
    //   }
    // });
    $submitActors.click(function(event) {
      // Here we can call the API
       submitActor = this;
       if(target_links.includes(location.pathname)) {
        event.preventDefault();

        $( "p.custom-notification-content" ).html(getInnerHTML('Barak', 'California').total_sign_up_modal);
       }
    });
    // remaining code
      // to count the number of visitors to website
})

function to show the inner content of pop-up
function showContent(code, param1 = '', param2 = '') {
  switch (code) {
    case 0:
      return `<b> ${param1} from ${param2} </b> recently signed Up. <br><strong class="verify">verified by Enkode </strong></p>`;
    case 1:
      return `<b> 444 people </b> are visiting <br>this page right now. <br><strong class="verify">verified by Enkode </strong>`

    default:
      return `9000 people has visited this page`;
  }
}
// call common function for variable parameters
function getInnerHTML(name = '', location ='') {
  let live_now_modal;
  live_now_modal = `
    <div class="custom-notification-image-wrapper">
      <img src="https://static1.squarespace.com/static/525dcddce4b03a9509e033ab/t/526800ffe4b0ee2599668050/1382547712599/fire.png">
    </div>
    <div class="custom-notification-content-wrapper">
      <p class="custom-notification-content">
        <b> 444 people </b> are visiting <br>this page right now. <br><strong class="verify">verified by Enkode </strong>
      </p>
    </div>`
  let total_sign_up_modal;
  total_sign_up_modal = `
    <div class="custom-notification-image-wrapper">
      <img src="https://tidings.today/wp-content/uploads/2018/08/tidings-today-logo-fav.png">
    </div>
    <div class="custom-notification-content-wrapper">
      <p class="custom-notification-content">
        <b> 444 people </b> are visiting <br>this page right now. <br><strong class="verify">verified by Enkode </strong>
      </p>
    </div>`
  let total_count_modal;
  total_count_modal = `
      <div class="custom-notification-image-wrapper">
        <img src="https://tidings.today/wp-content/uploads/2018/08/tidings-today-smartphones-1-768x576.jpg">
      </div>
      <div class="custom-notification-content-wrapper">
        <p class="custom-notification-content">
        <b> 99 has visited this site. <br><strong class="verify">verified by Enkode </strong>
        </p>
      </div>`
      return {
        live_now_modal,
        total_sign_up_modal,
        total_count_modal,
      }
}

//function to randomly show different pop-up messages
function showAlternate() {
  let array = [0,1,2]
  let number = array[Math.floor(Math.random() * array.length)];
  return showContent(number);
}
