---
title: Team
nav:
  order: 3
  tooltip: About our team
---

# <i class="fas fa-users"></i>The Team

{% include section.html %}

# Staff

{%
  include list.html
  data="members"
  component="portrait"
  filters="role: pi"
%}

{%
  include list.html
  data="members"
  component="portrait"
  filters="role: postdoc"
%}

{% include section.html %}
# Undergraduate Students
{%
  include list.html
  data="members"
  component="portrait"
  filters="role: ugrads"
%}

{% include section.html %}
# Visiting Scholars
{%
  include list.html
  data="members"
  component="portrait"
  filters="role: visiting"
%}


<!--
{%
  include list.html
  data="members"
  component="portrait"
  filters="role: phd"
%}
{%
  include list.html
  data="members"
  component="portrait"
  filters="role: programmer"
%}
{:.center}-->

{% include section.html background="images/maser1.jpg" dark=true %}

## We are always on the lookout for talented postdocs and PhD students
{:.center}

{%
  include link.html
  icon="fas fa-hands-helping"
  text="Get in touch"
  link="/contact/"
  style="button"
%}
{:.center}

{% include section.html %}
## Open positions

## [EPSRC PhD studentship in maser cavity quantum electrodynamics](https://www.jobs.ac.uk/job/CQV232/epsrc-phd-studentship-in-maser-cavity-quantum-electrodynamics)


## Collaborators

John Abraham @ John Hopkins  
[Neil Alford @ Imperial](https://www.imperial.ac.uk/people/n.alford)  
Cristian Bonato @ Heriot-Watt  
[Dyakonov group @ Wurzburg](https://www.physik.uni-wuerzburg.de/ep6/dyakonov-group/)  
[Chris Kay @ Saarbrucken](https://www.uni-saarland.de/lehrstuhl/kay.html)  
[Jerzy Krupka @ Warsaw](http://staff.elka.pw.edu.pl/~jkrupka/eng.html)  
[Hide Kurebayashi, Safe Khan & Christoph Zollitsch @ UCL](https://www.ucl.ac.uk/spintronics/)  
Riccardo Montis @ Urbino   
[John Morton @ UCL](https://www.ucl.ac.uk/quantum-spins/)  
[Mark Newton & Gavin Morley @ Warwick](https://warwick.ac.uk/fac/sci/physics/staff/academic/gmorley/)  
[Joshua Nunn @ Bath](https://researchportal.bath.ac.uk/en/persons/josh-nunn/)  
[Alex Pines & Ashok Ajoy @ UC Berkeley](http://www.cchem.berkeley.edu/aagrp/)  
[Enrico Salvadori @ Torino](https://www.chemistry.unito.it/do/docenti.pl/Alias?enrico.salvadori#tab-profilo)  
[Juna Sathian @ Northumbria](https://www.northumbria.ac.uk/about-us/our-staff/s/juna-sathian/)  


{% include section.html %}
## Funding

Our work is made possible by funding from the following organisations.
{:.center}

{%
  include gallery.html

  image1="images/UKRI_logo.png"
  link1="https://www.ukri.org/"

  image2="images/RS_logo.png"
  link2="https://royalsociety.org/"

  image3="images/EPSRC_logo.png"
  link3="https://www.ukri.org/councils/epsrc/"
  tooltip3="EPSRC"

%}

{% include section.html %}

## Industrial partners

{:.center}

{%
  include gallery.html

  image1="images/airbus-logo.png"
  link1="https://www.airbus.com/"
  tooltip1="Airbus"

  image2="images/e6-logo.png"
  link2="https://www.e6.com/en"
  tooltip2="Element Six"

  image3="images/keysight-logo.png"
  link3="https://www.keysight.com/"
  tooltip3="Keysight Technologies"

%}
