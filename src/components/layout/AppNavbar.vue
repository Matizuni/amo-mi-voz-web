<template>
  <header class="navbar">

    <div class="container navbar__container">

      <div class="navbar__logo">
        <span>AMO MI VOZ</span>
      </div>

      <nav class="navbar__menu">

        <a href="#academia">Academia</a>

        <a href="#">Talleres</a>

        <a href="#">Musicales</a>

        <a href="#">Galería</a>

        <a href="#">Contacto</a>

      </nav>

      <button class="navbar__button">

        Inscríbete

      </button>

    </div>

  </header>
</template>

<script setup>

</script>

<style scoped lang="scss">

@use '@/assets/styles/abstracts/variables' as variables;

.navbar{

    position:fixed;

    top:0;

    left:0;

    width:100%;

    z-index:variables.$z-header;

    backdrop-filter:blur(12px);

    background:rgba(0,0,0,.35);

    border-bottom:1px solid rgba(255,255,255,.08);

}

.navbar__container{

    display:flex;

    align-items:center;

    justify-content:space-between;

    height:80px;

}

.navbar__logo{

    font-family:variables.$font-family-heading;

    font-size:1.6rem;

    color:variables.$color-primary;

    font-weight:bold;

}

.navbar__menu{

    display:flex;

    gap:2rem;

}

.navbar__menu a{

    color:variables.$color-white;

    transition:.25s;

}

.navbar__menu a:hover{

    color:variables.$color-primary;

}

.navbar__button{

    background:variables.$color-primary;

    color:black;

    border:none;

    padding:.8rem 1.5rem;

    border-radius:variables.$radius-pill;

    cursor:pointer;

    font-weight:bold;

    transition:.25s;

}

.navbar__button:hover{

    transform:translateY(-2px);

}

</style>