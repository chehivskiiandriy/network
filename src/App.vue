<template>
  <div id="app" :class="{'app-login': checkLoginPage}">
    <template >
      <in-header/>
      <router-view />
      <in-footer/>
    </template>
    <in-regestationstep1-modal/>
    <in-registrationstep-two/>
    <notifications
      group="common"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div
          class="notification-guest"
          @click="props.close">
          <b class="title">
            {{props.item.text}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="guest-template"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.guestAuthText}}
          </b>
          <p>
            <button
              @click="goToLogin()"
              class="notification-button">
              {{$lang.variables.login}}
            </button>
          </p>
        </div>
      </template>
    </notifications>
    <notifications
      group="validating-template"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.you_are_validating}}
          </b>
          <p>
            <button
              @click="goToSecondForm()"
              class="notification-button">
              {{$lang.variables.fill}}
            </button>
          </p>
        </div>
      </template>
    </notifications>
    <notifications
      group="send-present"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.giftSended}}
          </b>

        </div>
      </template>
    </notifications>
    <notifications
      group="register-success"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.registerSuccess}}
          </b>
          <p>

            {{$lang.variables.goToEmail}}

          </p>
        </div>
      </template>
    </notifications>
    <notifications
      group="chin-chin"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{props.item.title}}
          </b>

        </div>
      </template>
    </notifications>
    <notifications
      group="write-to-you"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.cantWriteToYourself}}
          </b>

        </div>
      </template>
    </notifications>
    <notifications
      group="can-not-vote-for-yourself"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.cantVoteForYourself}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="can-not-raise-your-rating"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.cantRaiseYourRating}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="add-story"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.storyAdd}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="change-profile"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.saveСhange}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="cant-toyou"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.youCantDoThisToYourself}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="cant-sent-incoins-yourself"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.cantSendIncoinsYourself}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="nophone"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <p class="title">
            {{$lang.variables.notChatUser}}
          </p>
          <button class="notification-button">
            {{$lang.variables.cancel}}
          </button>
          <button
            @click="phoneSend()"
            class="notification-button">
            {{$lang.variables.confirm}}
          </button>
        </div>
      </template>
    </notifications>
    <notifications
      group="phone-reg"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          {{$lang.variables.phoneBusy}}
        </div>
      </template>
    </notifications>
    <notifications
      group="phone-incorrect"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          Некорректный номер телефона
        </div>
      </template>
    </notifications>
    <notifications
      group="nickname-reg"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          Данный никнейм уже занят
        </div>
      </template>
    </notifications>
    <notifications
      group="nickname-reg"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          {{$lang.variables.nicknameBusy}}
        </div>
      </template>
    </notifications>
    <notifications
      group="require-fields"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          {{$lang.variables.completeRequireFields}}
        </div>
      </template>
    </notifications>
    <notifications
      group="send-name"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.invalidName}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="send-pass"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.invalidPassword}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="send-nickname"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.invalidNickname}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="send-avatar"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.invalidAvatar}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="bad-login"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.invalidInfo}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="post-add"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.postAdded}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="repost-add"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Репост добавлен
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="add-rait"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.addRait}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="gift-send"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Подарок отправлен
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="money-send"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.incoinsSent}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="notactive-contest"
      :duration="3000"

      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Конкурс не активен
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="notstart-contest"
      :duration="3000"

      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Данный конкурс не активный вы не можете голосовать
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="not-active-contest-user"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Данный пользователь не активный вы не можете голосовать
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="change-pass"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Пароль изменен
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="cant-add-rait"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest" @click="props.close">
          <b class="title">
            {{props.item.text}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="wrong-email"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.incorrectEmail}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="empty-chat-message"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Нельзя отправить пустое сообщение
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="wrong-phone"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.incorrectNumber}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="wrong-phone-code"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Wrong SMS code
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="invalid-phone"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.invalidFormat}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="already-vote"
      :duration="5000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Вы уже проголосовали сегодня! Следующее голосование за данного пользователя будет доступно через сутки
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="not-enough-money"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Недостаточно средств
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="vote-coins-member"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{props.item.text}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="not-users"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Добавьте пользователей
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="copy-link"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.linkCopied}}
          </b>
        </div>
      </template>
    </notifications>


    <notifications
      group="one-more-gift"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.cantAcceptOneMoreGift}}
          </b>
        </div>
      </template>
    </notifications>

    <notifications
      group="action-error"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Во время данного действия произошла ошибка
          </b>
        </div>
      </template>
    </notifications>

    <notifications
      group="send-subscriber-request"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Заявка выслана
          </b>
        </div>
      </template>
    </notifications>

    <notifications
      group="support-question-send"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Вопрос успешно отправлен
          </b>
        </div>
      </template>
    </notifications>

    <notifications
      group="app-not-available"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Приложение будет доступно в ближайшее время
          </b>
        </div>
      </template>
    </notifications>

    <notifications
      group="subscribe-to-group"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.youJoinedTheGroup}}
          </b>
        </div>
      </template>
    </notifications>

    <notifications
      group="go-to-group"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            Вы подали заявку в группу
          </b>
        </div>
      </template>
    </notifications>

    <notifications
      group="user-is-invited-to-group"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.userIsInvitedToGroup}}
          </b>
        </div>
      </template>
    </notifications>

    <notifications
      group="max-size-error"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest" @click="props.close">
          <b class="title">
            Мax size 5 files
          </b>
        </div>
      </template>
    </notifications>

    <notifications
      group="chat-privacy-subscribe"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.chatPrivacySubscribe}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="chat-privacy-none"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.chatPrivacyNone}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="not-allfields-group"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.emptyInput}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="not-is-now"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.inUpdate}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="not-allfields-album"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.emptyInput}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="add-new-story-album__stories-are-not-selected"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.youHaveNotSelectedStories}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="add-new-story-album__cover-is-not-selected"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.youHaveNotSelectedCover}}
          </b>
        </div>
      </template>
    </notifications>
    <notifications
      group="add-new-story-album__title-is-not-entered"
      :duration="3000"
      width='100%'
      animation-name="v-fade-left"
      position="top left">
      <template
        slot="body"
        scope="props">
        <div class="notification-guest">
          <b class="title">
            {{$lang.variables.youHaveNotEnteredTitle}}
          </b>
        </div>
      </template>
    </notifications>
    <modal
      name="bannedUserModal"
      width="90%"
      classes=" v--modal banned-user-modal"
      :scrollable="true"
      height="auto">

      <div>
        <h3>Вы были заблокированы администратором</h3>
        <p>Cвяжитесь с нами по почте: <br>
          <a href="email:info@inrating.club">info@inrating.club</a>
          <br> Для того что бы уточнить причину банна.
        </p>
      </div>

    </modal>
    <modal
      name="bannedUserAvatarModal"
      width="90%"
      classes=" v--modal banned-user-modal"
      :scrollable="true"
      height="auto">
      <div>
        <h3>Ваш профиль заблокирован</h3>
        <p>Аватар должен содержать лицо собственника аккаунта (п.2 правил InRating). </p>
        <p @click="goToChangeProfile()">
          <router-link to="#">Сменить аватар</router-link>
        </p>
      </div>
    </modal>
    <!--<modal-->
      <!--name="editProfileForMoney"-->
      <!--width="90%"-->
      <!--classes=" v&#45;&#45;modal notify-user"-->
      <!--height="auto">-->
      <!--<div class="notify-user-modal">-->
        <!--<h3 class="notify-modal-title">Дозаполни личный профиль и получи + {{extraSum}}-->
          <!--<img src="https://media.inrating.top/storage/img/default/R-coin.png" class="coins-vote-blockimg">-->
          <!--INC</h3>-->
        <!--<p @click="goToChangeProfile()">Заполнить</p>-->
        <!--<p @click="notShowModal('editProfileForMoney')">{{$lang.modaltext.dontShowAgain}}</p>-->
        <!--<p @click="hideModal('editProfileForMoney')">{{$lang.modaltext.later}}</p>-->
      <!--</div>-->
    <!--</modal>-->
    <div
      v-if="showEditProfileModal"
      class="bg-modal"
      @click="hideEditProfile">
      <div class="bg-modal-center notify-user-modal">
        <h3 class="notify-modal-title">Дозаполни личный профиль и получи + {{extraSum}}
          <img src="https://media.inrating.top/storage/img/default/R-coin.png" class="coins-vote-blockimg">
          INC</h3>
        <p @click="goToChangeProfile()">Заполнить</p>
        <p @click="notShowModal('editProfileForMoney')">{{$lang.variables.dontShowAgain}}</p>
        <p @click="hideModal('editProfileForMoney')">{{$lang.variables.later}}</p>
      </div>
    </div>
    <!--<modal-->
      <!--name="googlePlay"-->
      <!--width="90%"-->
      <!--classes=" v&#45;&#45;modal notify-user"-->
      <!--height="auto">-->
      <!--<div class="notify-user-modal">-->
        <!--<h3 class="notify-modal-title">{{$lang.modaltext.app_exist}}</h3>-->
        <!--<div class="img-google-play">-->
          <!--<img src="https://media.inrating.top/storage/img/default/banner_android_app.jpg" alt="">-->
        <!--</div>-->
        <!--<p>-->
          <!--<a href="https://play.google.com/store/apps/details?id=com.inrating.android">{{$lang.modaltext.install}}</a>-->
        <!--</p>-->
        <!--<p @click="notShowModal('googlePlay')">{{$lang.modaltext.dontShowAgain}}</p>-->
        <!--<p @click="hideModal('googlePlay')">{{$lang.modaltext.later}}</p>-->
      <!--</div>-->
    <!--</modal>-->
    <div
      v-if="showGooglePlay"
      class="bg-modal"
      @click="hideAppOnGooglePlayModal">
      <div class="bg-modal-center notify-user-modal">
        <h3 class="notify-modal-title">{{$lang.variables.app_exist}}</h3>
        <div class="img-google-play">
          <img src="https://media.inrating.top/storage/img/default/banner_android_app.jpg" alt="">
        </div>
        <p>
          <a href="https://play.google.com/store/apps/details?id=com.inrating.android">{{$lang.variables.install}}</a>
        </p>
        <p @click="notShowModal('googlePlay')">{{$lang.variables.dontShowAgain}}</p>
        <p @click="hideModal('googlePlay')">{{$lang.variables.later}}</p>
      </div>
    </div>
    <in-phone-send/>
    <in-phone-confirm/>
    <in-repost-modal/>
    <modal
      name="notEnoughMoneyContest"
      width="90%"
      classes=" v--modal"
      height="auto">
      <div class="not-enough-money">
        <p>У Вас недостаточно средств в кошельке </p>
        <button
          class="button success"><a href="/buy?wallet=true">Перейти</a></button>
      </div>
    </modal>
    <div
      v-if="!loaded"
      class="spinner-bg">
      <img id="SpinnerPreload"
           class="spinner-svg"
           src="https://media.inrating.top/images/Spinner.svg"/>
    </div>
    <in-socket-io></in-socket-io>
  </div>
</template>
<script>
  import axios from 'axios';
  import moment from 'moment';

  import Vue from 'vue'
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'
  import RegistretionStep1 from 'ComponentsVue/modal/registrationModalStep1.vue'
  import registrationTwo from 'ComponentsVue/modal/registrationModalStep2'
  import phoneSend from 'ComponentsVue/modal/phoneSend'
  import repostModal from 'ComponentsVue/modal/repostModal'
  import phoneConfirm from 'ComponentsVue/modal/phoneConfirm'
  import SpinnerBG from 'ComponentsVue/UI/SpinnerBG'
  import event from 'JsLib/emit'
  import inSocketIo from 'ComponentsVue/Socket'
  import {mapActions, mapGetters} from 'vuex';

  import {INITIAL_LOADING, moduleName as countPostOnPageModule} from "Store/modules/countPostOnPage";
  import {ADD_LOADED, FETCH_CURRENT_USER, LOADED, moduleName as userModule} from "Store/modules/authUser/user";
  import {FETCH_MAIN_POSTS, GET_AUDIENCE, moduleName as mainPostsModule} from "Store/modules/mainPosts";
  import setAuthorizationHeader from 'utils/setAuthorizationHeader';
  import Nickname from 'ComponentsVue/UI/Nickname';
  import Spinner from 'ComponentsVue/UI/Spinner';
  import UserCard from 'ComponentsVue/UI/UserCard';
  import Tabs from 'ComponentsVue/UI/Tabs';
  import Tab from 'ComponentsVue/UI/Tab';
  import SearchBlock from 'ComponentsVue/UI/SearchBlock';
  import HeaderBlock from 'ComponentsVue/UI/HeaderBlock';
  import SettingsMenu from 'ComponentsVue/UI/SettingsMenu';
  import BottomButton from 'ComponentsVue/UI/BottomButton';
  import TransitionComponent from 'ComponentsVue/UI/TransitionComponent';
  import FileInput from 'ComponentsVue/postadd/FileInput';
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import TextWithMentions from 'ComponentsVue/TextWithMentions';
  import ConfirmationSettingsModal from "ComponentsVue/UI/ConfirmationSettingsModal";
  import PostShareModal from 'ComponentsVue/main/postfooter/PostShareModal';
  import MenuModal from 'ComponentsVue/UI/MenuModal';
  import MenuModalSection from 'ComponentsVue/UI/MenuModalSection';
  import MenuModalItem from 'ComponentsVue/UI/MenuModalItem';
  import MaskedPhoneInput from 'ComponentsVue/UI/MaskedPhoneInput';
  import BottomMenu, { BottomMenuSection, BottomMenuItem } from 'ComponentsVue/UI/BottomMenu';


  Vue.component('in-nickname', Nickname);
  Vue.component('in-spinner', Spinner);
  Vue.component('in-spinner-bg',SpinnerBG);
  Vue.component('in-phone-confirm', phoneConfirm);
  Vue.component('in-phone-send', phoneSend);
  Vue.component('in-registrationstep-two', registrationTwo);
  Vue.component('in-header', Header);
  Vue.component('in-footer', Footer);
  Vue.component('in-regestationstep1-modal', RegistretionStep1);
  Vue.component('in-socket-io', inSocketIo);
  Vue.component('in-repost-modal',repostModal);
  Vue.component('in-transition-component', TransitionComponent);
  Vue.component('in-file-input', FileInput);
  Vue.component('swiper', swiper);
  Vue.component('swiperSlide', swiperSlide);
  //Vue.component('in-content',UserProfile);

  Vue.component('in-user-card', UserCard);
  Vue.component('in-tabs', Tabs);
  Vue.component('in-tab', Tab);
  Vue.component('in-search-block', SearchBlock);
  Vue.component('in-header-block', HeaderBlock);
  Vue.component('in-settings-menu', SettingsMenu);
  Vue.component('in-bottom-button', BottomButton);
  Vue.component('in-text-with-mentions', TextWithMentions);
  Vue.component('in-confirmation-settings-modal', ConfirmationSettingsModal);
  Vue.component('in-menu-modal', MenuModal);
  Vue.component('in-menu-modal-section', MenuModalSection);
  Vue.component('in-menu-modal-item', MenuModalItem);
  Vue.component('in-masked-phone-input', MaskedPhoneInput);
  Vue.component('in-bottom-menu', BottomMenu);
  Vue.component('in-bottom-menu-section', BottomMenuSection);
  Vue.component('in-bottom-menu-item', BottomMenuItem);
  Vue.component('in-post-share-modal', PostShareModal);

  export default {
    name: 'app',
    data() {
      return {
        giftUserSendId: {},
        giftUserSendNickname: '',
        repostPost: {},
        intagArray: [],
        finalArray: [],
        repostNickname: '',
        historyLength: '',
        extraFields: [],
        extraSum: 0,
        loading: false,
        showGooglePlay: false,
        showEditProfileModal: false
      }
    },
    computed: {
      ...mapGetters({
        loaded: userModule + LOADED
      }),
      checkLoginPage() {
        return this.$route.fullPath === '/login' || this.$route.fullPath === '/registration' || this.$route.fullPath === '/reset-password';
      },
      checkNotUserPage() {
        return this.$route.fullPath === '/login'
          || this.$route.fullPath === '/registration'
          || this.$route.fullPath === '/reset-password'
          || this.$route.fullPath === '/public-offer-and-confidentiality'
          || this.$route.fullPath === '/rule-page';
      }
    },
    watch: {
      '$route'(to, from) {
        if((from.path.includes('/p/') && to.path.includes('/u/')) ||
          to.path === '/' ||
          (from.path === '/rating' && to.path === '/rating') ||
          (from.path.includes('/p/') && to.path.includes('/u/')) ||
          (from.path.includes('/contest/') && to.path.includes('/contest/'))
        ) {

        } else {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }

        if (to.path !== from.path) {
          this.historyLength++;
          if (this.historyLength % 200 === 0 && this.extraFields.length && !localStorage.getItem('editProfileForMoney')) {
            this.showUpdateProfileModal();
          }

          if (this.historyLength % 99 === 0 && !localStorage.getItem('googlePlay')) {
            this.showAppOnGooglePlayModal();
          }
        }
      }
    },
    created() {
      this.loadPostCount();
      this.getAudience();
    },
    mounted() {
      let contest_redirect = this.$route.path.split('/');

      if (contest_redirect[1] === 'rating' && contest_redirect[2] === 'contest') {
        if (contest_redirect[contest_redirect.length - 1] !== 'contest')
          this.$router.push('/contest/' + contest_redirect[contest_redirect.length - 1])
        else
          this.$router.push('/contests');
      }
      localStorage.setItem('clientWidth', window.innerWidth);


      this.getBonusField();
      this.historyLength = history.length;
      event.$on('bannedUser', () => {
        this.$modal.show('bannedUserModal');
      });
      event.$on('bannedUserAvatar', () => {
        this.$modal.show('bannedUserAvatarModal');
      });
      event.$on('noChatUser', () => {
        this.$notify({
          group: 'nophone',
          duration: 3000,
          speed: 300,
        });
      });
      event.$on('guestUser', () => {
        this.$notify({
          group: 'guest-template',
          duration: 2000,
          speed: 500,
        });
      });
      if (this.$route.path === '/rating/contest/kpi_queen_2018') {
        this.$router.push('/contest/kpi_queen_2018')
      }

      this.checkUser();

      this.$root.$on('postModalPresent', (event) => {
        this.giftUserSendId = event;
      });
      this.$root.$on('postModalPresentNickname', (event) => {
        this.giftUserSendNickname = event;
      });
      let userLang = localStorage.getItem('lang');
      if(userLang) {
        moment.locale(userLang);
      }
    },
    methods: {
      ...mapActions({
        loadPostCount: countPostOnPageModule + INITIAL_LOADING,
        fetchCurrentUser: userModule + FETCH_CURRENT_USER,
        addLoaded: userModule + ADD_LOADED,
        fetchMainPosts: mainPostsModule + FETCH_MAIN_POSTS,
        getAudience: mainPostsModule + GET_AUDIENCE
      }),
      checkUser() {
        let token = localStorage.getItem('token');
        const payload = {onSuccess: this.onSuccess, onFail: this.onFail};

        if (token) {
          this.fetchCurrentUser(payload);
        } else if (!token) {
          if (this.checkNotUserPage) {
            this.addLoaded();
          } else {
            let userLang = localStorage.getItem('lang');
            if (!userLang) userLang = 'en';
            axios.get('v1/guest/get?lang=' + userLang)
              .then(res => {
                  let requestTokenData = {
                    client_id: 2,
                    client_secret: '0123456789987654321',
                    grant_type: 'password',
                    username: res.data.nickname,
                    password: res.data.nickname,
                  };
                  axios.post('oauth/token', requestTokenData)
                    .then(res => {
                      let token = res.data.access_token;
                      localStorage.setItem('token', token);

                      setAuthorizationHeader(token);
                      this.fetchCurrentUser(payload);
                    })
                    .catch(err => console.log(err));
                }
              )
              .catch(err => console.log(err));
          }
        }
      },
      onSuccess() {
        this.fetchMainPosts();
        this.$root.$emit('getGuestToken');
      },
      onFail() {
        this.$router.push('/login');
      },
      notShowModal(modalName) {
        localStorage.setItem(modalName, 'true');
        this.hideModal(modalName);
      },
      hideModal(modalName) {
        this.$modal.hide(modalName);
      },
      getBonusField() {
        if (JSON.parse(localStorage.getItem('user'))) {
          axios.get('v1/me/settings/bonus-fields')
            .then(res => {

              this.extraFields = res.data;
              this.extraFields.map((item) => {
                this.extraSum = this.extraSum + item.coins;
              })
            });
        }
      },
      addIntag() {
        let inputIntag = document.getElementById('input-intag').value;
        let toAdd = this.intagArray.indexOf(inputIntag);
        if (toAdd === -1) {
          let inHeaders = inputIntag.indexOf('^^');
          if (inHeaders === 0) {
            inputIntag = inputIntag.substring(2);
          }
          this.intagArray.push(inputIntag);
        }
        document.getElementById('input-intag').value = '';
      },
      deleteIntag(i) {
        this.intagArray.splice(i, 1);
      },
      goToLogin() {
        this.$router.push('/login');
        this.$notify({
          group: 'guest-template',
          clean: true
        })
      },
      goToSecondForm() {
        this.$router.push('/continue-register');
        this.$notify({
          group: 'validating-template',
          clean: true
        })
      },
      showRepost(id) {
        this.finalArray = [];
        axios.get('v1/users/posts/get?id=' + id)
          .then(res => {
            this.repostPost = res.data;
            this.repostNickname = this.repostPost.author.nickname;
            for (let i = 0; i < this.repostPost.attachments_order.length; i++) {
              if (this.repostPost.attachments_order[i].type === 'image') {
                for (let j = 0; j < this.repostPost.attachments.images.length; j++) {
                  if (this.repostPost.attachments_order[i].id === this.repostPost.attachments.images[j].id)
                    this.finalArray.push({
                        type: 'img',
                        body: this.repostPost.attachments.images[j],
                      }
                    );
                }
              }
              else if (this.repostPost.attachments_order[i].type === 'video') {
                for (let j = 0; j < this.repostPost.attachments.videos.length; j++) {
                  if (this.repostPost.attachments_order[i].id === this.repostPost.attachments.videos[j].id)
                    this.finalArray.push({
                        type: 'video',
                        body: this.repostPost.attachments.videos[j],
                      }
                    );
                }
              }
            }
          })
      },
      closeRepost() {
        this.$modal.hide('repostModal');
      },
      makeRepost() {
        let title = document.getElementById('repost-text-body').value;
        let intags = JSON.stringify(this.intagArray);
        let id = this.repostPost.id;
        let params = {
          id: id,
          title: title,
          intags: intags,
        };
        axios.post('v1/users/posts/repost', params)
          .then(res => {
            this.$modal.hide('repostModal');
            window.location.reload();
          })
      },
      phoneSend() {
        this.$modal.show('modalPhoneSend');
        this.$notify({
          group: 'nophone',
          clean: true
        })
      },
      goToChangeProfile() {
        this.$modal.hide('bannedUserAvatarModal');
        this.$modal.hide('editProfileForMoney');
        this.$router.push('/setting/user');
      },
      showUpdateProfileModal() {
        // this.$modal.show('editProfileForMoney');
        this.showEditProfileModal = true;
      },
      showAppOnGooglePlayModal() {
        // this.$modal.show('googlePlay');
        this.showGooglePlay = true;
      },
      hideAppOnGooglePlayModal() {
        this.showGooglePlay = false;
      },
      hideEditProfile() {
        this.showEditProfileModal = false;
      }

    }
  }

</script>

<style lang="less">
  @import '~LessStyle/variables.less';
  @import '~LessStyle/notifications.less';
  @import '~LessStyle/postaddtext.less';
  @import '~LessStyle/style.less';

  .progress-files-loading-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: 0;
    transition: all 5s ease-out;
    background: linear-gradient(to right, #000fbc, #30c2be);
  }
  body {
    max-width: 1200px;
    margin: 0 auto;
    word-wrap: break-word;
  }

  #header {
    max-width: 1200px;
    margin: 0 auto !important;
  }

  #footer {
    max-width: 1200px;
    margin: 0 auto !important;
  }

  .repost-block {
    width: 100%;
    height: 90vh;
    overflow-y: scroll;
    text-align: center;
  }

  .bg-modal {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);

    &-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      height: auto;
      z-index: 1000;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 20px 60px -2px rgba(27, 33, 58, 0.4);;
    }
  }
  .close-repost {
    position: absolute;
    left: 10px;
  }


  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 43px;
    padding-bottom: 70px;
  }

  .app-login {
    margin: 0 !important;
    padding: 0 !important;
  }

  *:focus {
    outline: none;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: @contest-list-text-color;
    text-decoration: none;
  }

  #SpinnerPreload {
    display: block;
  }

  .spinner-bg {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1555;
    /*background: rgba(0, 0, 0, 0.2);*/
    background: #f4f4f4;

    .spinner-svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 35%;
    }
  }

  /*.spinner-svg{*/
  /*position: absolute;*/
  /*top: 25%;*/
  /*left: 10%;*/
  /*width: 78%;*/
  /*margin: auto;*/
  /*}*/

  .banned-user-modal {
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
  }

  .notify-user {
    border-radius: 10px;
  }

  .notify-user-modal {
    text-align: center;

    p {
      padding: 15px 0;
      margin: 0 5px;
      border-top: 1px solid #ccc;
      color: @contest-list-text-color;
    }
  }

  .img-google-play {
    border-radius: 10px;
    overflow: hidden;

    img {
      width: 100%;
    }
  }

  .notify-modal-title {
    padding: 15px 30px;
    margin: 0 auto;
    font-size: 4.3vw;

    .coins-vote-blockimg {
      width: 18px;
      position: relative;
      top: 2px;
    }
  }

  .not-enough-money {
    text-align: center;
    padding: 20px 0px;
  }
</style>
