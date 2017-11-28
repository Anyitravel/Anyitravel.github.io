---
layout: default
page_name: index
---

<ul class="listing">
{% for post in site.posts %}
  <a class="listing-item" href="{{ post.url }}" title="{{ post.title }}">
    {% if post.thumb %}
        <b class="thumb"
            style="background-image: url({{ post.thumb | absolute_url}})"></b>
    {% else %}
        <b class="thumb"
            style="background-image: url({{ '/media/files/default_thumb.jpg' | absolute_url }})"></b>
    {% endif %}
    <h1>{{ post.title }}</h1>
    <time datetime="{{ post.date | date:"%B %d, %Y" }}">
        {{ post.date | date:"%B %d, %Y" }}
    </time>
    <p class="excerpt">{{ post.excerpt | strip_html | truncatewords: 50}}</p>
  </a>
{% endfor %}
</ul>
