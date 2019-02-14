<template>
    <div class="group-item">
        <div class="group-item--avatar">
            <a data-id="BorussiaDortmundNovosti" href="https://m.inrating.top/group/BorussiaDortmundNovosti"><img :src="group.logo.url_small"></a>
        </div>
        <div class="group-item--info">
            <p class="group-info--nickname" v-text="group.name"></p>
            <p class="group-info--subscribe" v-text="group.logo.mentioned_users_count+'подписчика'">  </p>
        </div>
    </div>
</template>

<script>
export default {
    name:"groupItem",
    props:['group'],
}
</script>

<style>
    .group-item {
    display: flex;
    padding: 6px;
    border-radius: 10px;
    box-shadow: 2px 2px 0px 0px rgba(95, 92, 92, 0.2);
    justify-content: space-between;
    align-items: center;
}
.group-item--avatar {
    width: 60px;
    border-radius: 10px;
}
.group-item--avatar img {
    border-radius: 10px;
    width: 60px;
    height: 60px;
    display: block;
}
.group-item--info {
    padding-left: 10px;
    padding-right: 10px;
    text-align: right;
}

.group-info--subscribe, .group-info--nickname {
    margin: 0px;
    font-size: 14px;
}

.group-info--nickname {
    font-weight: 600;
    margin-bottom: 5px;
}


</style>
