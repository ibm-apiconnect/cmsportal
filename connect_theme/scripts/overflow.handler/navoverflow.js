/********************************************************* {COPYRIGHT-TOP} ***
 * Licensed Materials - Property of IBM
 * 5725-L30, 5725-Z22
 *
 * (C) Copyright IBM Corporation 2018, 2026
 *
 * All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 ********************************************************** {COPYRIGHT-END} **/

/**
 * @file
 * Used by the main nav menu to handle overflow items to save wrapping additional menu items to second row
 */

(function ($, Drupal, drupalSettings) {

  function recalculateOverflow() {
    if ($('#navoverflow').length) {
      /* get all the child items from #navoverflow and put back on the main nav */
      var $mainNav = $('.main-menu div ul.nav');
      var $overflowItems = $('#navoverflow ul.dropdown-menu').children('li');

      $overflowItems.each(function () {
        var $this = $(this);
        $this.appendTo($mainNav);
      });

      $('#navoverflow').remove();
    }
    /* see if it needs creating */
    $('.main-menu div ul.nav').overflowHandler({
      overflowItem: {
        text: '',
        href: '#',
        className: 'has-child'
      },
      bootstrapMode: true
    });
  }

  function on_resize(c, t) {
    var resizeTimer;
    $(window).on('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(c, 100);
    });
    return c;
  }

  Drupal.behaviors.createMainNavOverflow = {
    attach: function (context) {
      recalculateOverflow();

      // Observe mutations on the admin toolbar if present (expanded/collapsed)
      var toolbarElement = document.querySelector('.admin-toolbar') || document.body;
      if (window.MutationObserver && toolbarElement && !toolbarElement._overflowObserverAttached) {
        var observer = new MutationObserver(function () {
          recalculateOverflow();
        });
        observer.observe(toolbarElement, { attributes: true, attributeFilter: ['data-admin-toolbar', 'class', 'style'] });
        toolbarElement._overflowObserverAttached = true;
      }
    }
  };

  Drupal.behaviors.resizeMainNav = {
    attach: on_resize(function () {
      recalculateOverflow();
    })
  };


})(jQuery, Drupal, drupalSettings);