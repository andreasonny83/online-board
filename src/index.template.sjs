<!doctype html>
<html>
<!--
Online Board
Copyright 2017, Andrea Sonny, All rights reserved.
@author: Andrea Sonny <andreasonny83@gmail.com>
-->
<head>
  <base href="<%= htmlWebpackPlugin.options.metadata.baseUrl %>">
  <meta charset="utf-8">
  <title><%= htmlWebpackPlugin.options.title %></title>
  <meta name="description" content="<%= htmlWebpackPlugin.options.metadata.description %>">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- SEO -->
  <meta name="thumbnail" content="<%= htmlWebpackPlugin.options.metadata.thumbnail %>">
  <meta name="keywords" content="<%= htmlWebpackPlugin.options.metadata.keywords %>">
  <meta property="og:title" content="<%= htmlWebpackPlugin.options.metadata.title %>">
  <meta property="og:site_name" content="<%= htmlWebpackPlugin.options.metadata.title %>">
  <meta property="og:type" content="website">
  <meta property="og:url" content="<%= htmlWebpackPlugin.options.metadata.url %>">
  <meta property="og:image" content="<%= htmlWebpackPlugin.options.metadata.thumbnail %>">
  <meta name="twitter:image" content="<%= htmlWebpackPlugin.options.metadata.thumbnail %>">

  <!-- PWA -->
  <meta name="apple-mobile-web-app-title" content="<%= htmlWebpackPlugin.options.title %>">

  <% if (webpackConfig.htmlElements.headTags) { %>
  <!-- Configured Head Tags  -->
  <%= webpackConfig.htmlElements.headTags %>
  <% } %>

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-99012696-1', 'auto');
    ga('send', 'pageview');
</script>
</head>
<body>
  <app-root>
    <div id="app-loading">
      <h1>Online Board</h1>
      <div class="loader">Loading...</div>
    </div>
  </app-root>
</body>
</html>
