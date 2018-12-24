var live_now_modal = document.createElement('innerHTML'); // is a node
live_now_modal.innerHTML = `
  <link rel="stylesheet" type="text/css" href="css/index.css"/>
  <section class="custom-social-proof" >
    <div class="custom-notification">
      <div class="custom-notification-container">
        <div class="custom-notification-image-wrapper">
          <img src="https://static1.squarespace.com/static/525dcddce4b03a9509e033ab/t/526800ffe4b0ee2599668050/1382547712599/fire.png">
        </div>
        <div class="custom-notification-content-wrapper">
          <p class="custom-notification-content">
            <b> 444 people </b> are visiting <br>this page right now. <br><strong class="verify">verified by Enkode </strong>
          </p>
        </div>
      </div>
      <div class="custom-close"> <i class="fa-fa-close"></i></div>
    </div>
  </section>
`;

var total_sign_up_modal = document.createElement('innerHTML'); // is a node
total_sign_up_modal.innerHTML = `
  <link rel="stylesheet" type="text/css" href="css/index.css"/>
  <section class="custom-social-proof" >
    <div class="custom-notification">
      <div class="custom-notification-container">
        <div class="custom-notification-image-wrapper">
          <img src="https://tidings.today/wp-content/uploads/2018/08/tidings-today-logo-fav.png">
        </div>
        <div class="custom-notification-content-wrapper">
          <p class="custom-notification-content">
            <b> name from location</b><br>has recntly signed up. <br><strong class="verify">verified by Enkode </strong>
          </p>
        </div>
      </div>
      <div class="custom-close"> <i class="fa-fa-close"></i></div>
    </div>
  </section>
`;

var total_count_modal = document.createElement('innerHTML'); // is a node
total_count_modal.innerHTML = `
  <link rel="stylesheet" type="text/css" href="css/index.css"/>
  <section class="custom-social-proof" >
    <div class="custom-notification">
      <div class="custom-notification-container">
        <div class="custom-notification-image-wrapper">
          <img src="https://tidings.today/wp-content/uploads/2018/08/tidings-today-smartphones-1-768x576.jpg">
        </div>
        <div class="custom-notification-content-wrapper">
          <p class="custom-notification-content">
            <b> 99 has visited this site. <br><strong class="verify">verified by Enkode </strong>
          </p>
        </div>
      </div>
      <div class="custom-close"> <i class="fa-fa-close"></i></div>
    </div>
  </section>
`;

$(function() {


  let $form = $('body');
  // // $(".custom-social-proof").stop().slideToggle('slow', function() {
    setInterval(function() {
      $(".custom-social-proof").stop().slideToggle('slow')
      $form.append(live_now_modal)
    }, 4000);

    setInterval(function() {
      $(".custom-social-proof").stop().slideToggle('slow')
      $form.append(total_count_modal)
    }, 5000);

    setInterval(function() {
      $(".custom-social-proof").stop().slideToggle('slow')
      $form.append(total_sign_up_modal)
    }, 6000);
  // // }, 10000);

  // setInterval(function() {

    // $(".custom-social-proof").stop().slideToggle('slow', function() {
    //   $( "p.custom-notification-content" ).html(showAlternate());
    // });
    // }, 3000);
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

        // $( "p.custom-notification-content" ).html(showContent(0, 'Barak', 'California'));
       }
    });

    $( window ).on( "load", function() {
      // API to record number of visitors
    });

    // remaining code
      // to count the number of visitors to website
})
