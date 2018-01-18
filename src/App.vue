<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    if (process.env.NODE_ENV == 'development') this.$router.push('/catch')
  }
}
</script>

<style>
@import url(//at.alicdn.com/t/font_316150_nmzks0hbfba10pb9.css);
@import url(//at.alicdn.com/t/font_385880_yj22sx6x51rwwmi.css);


html{
  font-size: 40px;
}
html,body {
  width: 100%;
  height: 100%;
}

a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, p, pre, q, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font: inherit;
  vertical-align: baseline;
  box-sizing: border-box;
}

.clearfix:before,
.clearfix:after {
  display: table;
  line-height: 0;
  content: "";
}
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #000;
  font-size: 0.22rem;
  padding-bottom: constant(safe-area-inset-bottom);
}

</style>
