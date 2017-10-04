'use strict';

// @TODO: can we do it without jQuery? :D
(function () {
  function endUrlWithSlash(url) {
    if (url.endsWith('/')) {
      return url;
    }

    return url + '/';
  }

  var currentPath = endUrlWithSlash(window.location.pathname);

  // active top nav links
  var $topNavLinks = $('nav .nav-left a');
  $topNavLinks.each(function () {
    var url = endUrlWithSlash($(this).attr('href'));

    if (currentPath.indexOf(url) > -1) {
      $topNavLinks.removeClass('is-active');
      $(this).addClass('is-active');
    }
  });

  // active sidebar links
  var $asideLinks = $('aside.menu.docs > ul > li > a');
  $asideLinks.each(function () {
    var url = endUrlWithSlash($(this).attr('href'));

    if (currentPath.indexOf(url) > -1) {
      $asideLinks.removeClass('is-active');
      $(this).addClass('is-active');

      // mount TOC in sidebar from content area
      var $lists = $('.content ul');

      if ($lists.length === 0) {
        // is not TOC
        return;
      }

      if (!$($lists[0]).find('li:first-child').html().startsWith('<a')) {
        // is not TOC
        return;
      }

      var $toc = $($lists[0]);
      $toc.hide();
      $(this).after('<ul>' + $toc.html() + '</ul>');
    }
  });

  // hashed links
  $('a[href^="#"]').click(function () {
    var href = $(this).attr('href');

    if (history.pushState) {
      history.pushState(null, null, href);
    }

    $('html, body').animate({
      scrollTop: $(href).offset().top - 65
    }, 300);

    return false;
  });

  // hyperlink headers
  $('.content h1, .content h2, .content h3, .content h4').each(function () {
    var $h = $(this);

    if ($h.hasClass('no-permalink')) {
      return;
    }

    var id = $h.attr('id');
    var title = $h.text();
    var html = $h.html();

    if (html.indexOf('<a') > -1) {
      return;
    }

    var newHtml = $('<a>' + title + '</a>').attr('href', '#' + id).addClass('permalink').click(function (e) {
      if (history.pushState) {
        history.pushState(null, null, '#' + id);
      }

      $('html, body').animate({
        scrollTop: $h.offset().top - 65
      }, 300);

      return false;
    });

    $(this).html(newHtml);
  });
})();