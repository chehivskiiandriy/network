<template>
  <div
    class="member-block" @click="showInfo">
    <!-- left -->
    <div
      v-if="contestType !== 3 && contestType !== 1 && contestType !== 8"
      class="member-place"
      :class="{'member-place-disabled': !member.contest_info.is_active}">
      <div>
        <p class="member-place--title">{{$lang.variables.placeInTheRating}}</p>
      </div>
      <p
        class="chart-place"
        v-text="member.contest_info.contest_current_position"></p>
      <div class="member-place__name">
        <span v-text="member.name"></span>
        <span v-text="member.lastname"></span>
      </div>
      <div class="member-names">
        <router-link :to="'/u/'+member.nickname">
          <in-nickname
            tag="p"
            class="member-nickname"
            :status="member.status">
            <div class="member-nickname__nickname-wrapper">
              <span class="member-nickname__nickname">{{member.nickname}}</span>
            </div>
          </in-nickname>
        </router-link>
      </div>

    </div>
    <div
      v-else
      class="member-place"
      :class="{'member-place-disabled': !member.contest_info.is_active}">
      <div class="member-place__name">
        <span v-text="member.name"></span>
        <span v-text="member.lastname"></span>
      </div>
      <div
        @click=goToUser
        class="member-names">
        <in-nickname
          tag="p"
          class="member-nickname"
          :status="member.status"
          :icon-on-next-line="true">
          <div class="member-nickname__nickname">
            <span class="member-nickname__nickname_gradient">{{member.nickname}}</span>
          </div>
        </in-nickname>
      </div>
      <p
        class="chart-place"
        v-text="member.contest_info.contest_current_position"></p>
      <p class="constest-sponsor-name" v-if="showSponsor">
        <span>TOP</span><br>
        <span v-if="sponsorName === 'day'">Дня</span>
        <span v-else>Недели</span>
      </p>
      <p class="member-coins-rating">
        <i
          class="icon-heart_R heart-for-vote"
          aria-hidden="true">
        </i>
        <span
          class="member-allvotes--count"
          v-text="ratingSumm"></span>
      </p>
    </div>

    <!-- center -->
    <div class=" member-avatar">
      <div @click="goToUser">
        <img
          class="contest-user-photo"
          :src="member.avatar_image.url_medium"
          alt="">
        <img
          v-if="member.active_gift!=null"
          class="contest-user-avatar-image"
          :src="member.active_gift.image">
      </div>
      <div class="member-raiting">
        <i
          class="icon-logo-f"
          aria-hidden="true"></i>
        <span v-text="member.contest_info.rating"></span>
      </div>
      <div class="member-placeinlist">
        <span v-text="'№'+member.contest_info.contest_initial_position"></span>
      </div>
    </div>

    <!-- right -->
    <div
      v-if="contestType !== 3 && contestType !== 1 && contestType !== 8"
      class="member-vote">
      <div>
        <a
          href="#"
          v-text="member.contest_info.extra"></a>
      </div>
      <div>
        <div>
          <p
            class="member-likes"
            @click="userVote()">
            <i
              class="icon-heart-f small_heart"
              aria-hidden="true"
              v-if="is_voted || !active"
              :style="{color:'#d3d3d3'}"></i>
            <i
              class="icon-heart-f small_heart"
              aria-hidden="true"
              v-else></i>
            <span v-text="member_likes"></span>
          </p>
          <p class="member-allvotes">
            <i
              v-if="!active"
              :style="{color:'#d3d3d3'}"
              class="icon-heart_R heart-for-vote"
              aria-hidden="true">
            </i>
            <i
              v-else
              class="icon-heart_R-f heart-for-vote"
              aria-hidden="true">
            </i>

            <span
              class="member-allvotes--count"
              v-text="all_count"></span>
          </p>
        </div>
      </div>
      <div>
        <div class="member-contact">
          <router-link :to="'/u/'+member.nickname">
            <i
              class="icon-profile-settings "
              aria-hidden="true"></i>
          </router-link>
          <a @click="goToChat(member.id)">
            <i
              class="icon-speech "
              aria-hidden="true"></i>
          </a>
        </div>
      </div>

    </div>
    <div
      v-else
      class="member-vote-coinspack" @click="closeCoinsBlock">
      <transition name="fade" mode="out-in">
        <div
          v-if="isRaiseRating"
          @click="raiseRating()"
          :class="coinsVoteBlock"
          class="raise">
          В профиль
          <i class="icon-right-f"></i>
        </div>
        <div
          v-else
          @click="raiseRating()"
          :class="[coinsVoteBlock, {'block-disabled': member.status === 'banned_of'}]"
          class="raise">
          {{$lang.variables.raise}}
          <i class="icon-logo-f" aria-hidden="true"></i>
        </div>
      </transition>
      <template v-if="contestType !== 1 && contestType !== 8">
        <div
          @click="showAllCoinsVoteBloks()"
          :class="coinsVoteBlock"
          class="coins-block">
          {{$lang.variables.vote}}
          <img class="coins-vote-blockimg" :src="contestCoin">
        </div>
        <div
          class="member-coins-earn"
          :class="{'member-coins-earn-disabled': !member.contest_info.is_active}">
          <img
            class="member-coins-earnimg"
            :src="contestMoney">
          <p>{{coinsLike*10}} <span class="subcoins">({{coinsLike }} R)</span></p>
        </div>
        <transition name="fade">
          <div
            v-if="coinsPriceBlock"
            class="member-coins-price">

            <div
              class="coins-vote-block "
              @click="voteCoins(10)"> <span>10 <img
              class="coins-vote-blockimg"
              :src="contestCoin"></span> <span>(+1<i class="icon-logo-f"></i>)</span>
            </div>

            <div
              class="coins-vote-block"
              @click="voteCoins(100)"><span>100 <img
              class="coins-vote-blockimg"
              :src="contestCoin"></span> <span>(+10<i class="icon-logo-f"></i>)</span>
            </div>

            <div
              class="coins-vote-block "
              @click="voteCoins(1000)"><span>1000 <img
              class="coins-vote-blockimg"
              :src="contestCoin"></span> <span>(+100<i class="icon-logo-f"></i>)</span>
            </div>
          </div>
        </transition>
      </template>
      <template v-else>
        <div
          @click="userVote"
          class="likes-block coins-vote-block">
          <!-- TODO: use lang variable -->
          {{$lang.variables.vote}}
        </div>
        <p
          class="member-likes member-likes_contest-type-1">
          <i
            :class="memberLikesContestType1HeartIconClasses"
            class="icon-heart-f small_heart member-likes_contest-type-1__heart-icon"
            aria-hidden="true"></i>
          <span
            :class="memberLikesContestType1CounterClasses"
            class="member-likes_contest-type-1__counter">{{member_likes}}</span>
        </p>
      </template>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'contestMember',
    props: ['contest', 'active', 'type', 'member', 'sponsorName', 'showSponsor'],
    data() {
      return {
        contestType: this.type,
        is_voted: this.member.contest_info.is_voted,
        member_likes: this.member.contest_info.likes,
        all_count: this.member.contest_info.likes + this.member.contest_info.rating,
        user: JSON.parse(localStorage.getItem('user')),
        contestCoin: img.rCoin,
        contestMoney: img.rCoinStack,
        coinsPriceBlock: false,
        coinsLike: this.member.contest_info.likes,
        ratingLike: this.member.contest_info.rating,
        ratingSumm: this.member.contest_info.likes + this.member.contest_info.rating,
        isRaiseRating: false,
      }
    },
    computed: {
      voteCoinsPrice() {
        if (this.coinsPriceBlock)
          return 'member-coins-price';
        else
          return 'member-coins-price-hide'
      },
      coinsVoteBlock() {
        if (this.memberIsCurrentUser)
          return 'coins-vote-block coins-vote-absolute coins-vote-block_disabled';
        if (!this.coinsPriceBlock)
          return 'coins-vote-block coins-vote-absolute';
        return 'coins-vote-block-hide'
      },
      memberIsCurrentUser() {
        return this.user.nickname === this.member.nickname;
      },
      memberLikesContestType1HeartIconClasses() {
        if (this.is_voted || !this.active) {
          return 'member-likes_contest-type-1_disabled__heart-icon';
        }
        return '';
      },
      memberLikesContestType1CounterClasses() {
        if (this.is_voted || !this.active) {
          return 'member-likes_contest-type-1_disabled__counter';
        }
        return '';
      },
      nickname() {
        return this.member.nickname;
      },
    },
    mounted() {
      this.$root.$on('hideButtons', () => {
        this.coinsPriceBlock = false;
      });
    },
    methods: {
      goToUser() {
        if (this.member.status !== 'banned_of') {
          this.$router.push('/u/' + this.member.nickname);
        }
      },
      showInfo() {
        console.log(this.contest, this.member);
      },
      closeCoinsBlock(e) {
        let className = e.srcElement.className;

        if (!this.memberIsCurrentUser && ~className.indexOf('coins-block')) {
          this.coinsPriceBlock = true;
        } else if (className.indexOf('coins-vote-block')) {
          this.coinsPriceBlock = false;
        } else {
        }
      },
      raiseRating() {
        if (!this.memberIsCurrentUser) {
          if (this.member.contest_info.is_active && this.member.status !== 'banned_of') {
            if (this.user.status === 'guest') {
              this.$notify({
                group: 'guest-template',
                duration: 3000,
                speed: 300,
              });
            } else {
              setTimeout(() => {
                this.$router.push('/u/' + this.member.nickname);
              }, 300);
            }

          } else {
            this.$notify({
              group: 'not-active-contest-user',
              duration: 3000,
              speed: 300,
            });
          }
        } else {
          this.whenCurrentUserCantRaiseYourRating();
        }
      },
      userVote() {
        if (this.$userStatus(this.user)) {
          if (this.user.status === 'guest') {
            this.$notify({
              group: 'guest-template',
              duration: 3000,
              speed: 300,
            });
          } else {
            let data = new FormData();
            data.append('contest_id', this.contest.id);
            data.append('user_id', this.member.id);
            const config = {headers: {'Content-Type': 'multipart/form-data'}};
            axios.post('v1/contests/users/vote', data, config)
              .then(res => {
                if (res.data.state) {
                  this.is_voted = true;
                  this.member_likes++;
                  this.all_count++;
                }
                else {
                  this.$notify({
                    group: 'already-vote',
                    duration: 3000,
                    speed: 300,
                  })
                }
              })
              .catch(err => {
                if (err.response.data.message == 'Contest is not active') {

                  this.$notify({
                    group: 'notactive-contest',
                    duration: 3000,
                    speed: 500,
                  });
                }
                else if (err.response.data.errorInfo.errorCode == 1000) {
                  this.$modal.show('bannedUserAvatarModal')
                  axios.get('v1/me')
                    .then(res => {
                      localStorage.setItem('user', JSON.stringify(res.data));

                    });

                }

              });
          }
        }

      },
      goToChat(id) {
        let userID = JSON.parse(localStorage.getItem('user')).id;
        if (userID != id) {
          axios.get('v1/me/chats/check?id=' + id)
            .then(res => {
              if (res.data.state)
                this.$router.push('/messages/' + res.data.id);
              else
                this.$router.push('/new-chat/' + id);
            })
        }
        else {
          this.$notify({
            group: 'write-to-you',
            duration: 3000,
            speed: 300,
          });
        }

      },
      alreadyVote() {
        this.$notify({
          group: 'already-vote',
          duration: 3000,
          speed: 300,
        })
      },
      showAllCoinsVoteBloks() {
        if (!this.memberIsCurrentUser) {
          this.$root.$emit('hideButtons');
          this.coinsPriceBlock = true;
        } else {
          this.whenCurrentUserCantVoteForYourself();
        }
      },
      voteCoins(coins) {
        if (!this.member.contest_info.is_active) {
          this.$notify({
            group: 'not-active-contest-user',
            duration: 3000,
            speed: 300,
          });
        } else if (this.$userStatus(this.user)) {
          let data = new FormData();
          data.append('contest_id', this.contest.id);
          data.append('user_id', this.member.id);
          data.append('amount', coins);
          const config = {headers: {'Content-Type': 'multipart/form-data'}};
          axios.post('v1/contests/users/vote', data, config)
            .then(res => {
              if (res.data.state) {
                this.coinsLike += coins / 10;
                this.ratingSumm = this.coinsLike + this.ratingLike;

                this.$notify({
                  group: 'vote-coins-member',
                  duration: 3000,
                  speed: 300,
                  text: 'Вы отправили ' + coins + ' INCoins',
                })
              }
              else {
                this.$modal.show('notEnoughMoneyContest');
              }
            })
            .catch(err => {
              if (err.response.data.message === 'Contest is not active') {
                this.$notify({
                  group: 'notstart-contest',
                  duration: 3000,
                  speed: 300,
                });
              } else {
                this.$modal.show('notEnoughMoneyContest');
              }
            })
        }
      },
      whenCurrentUserCantVoteForYourself() {
        this.$notify({
          group: 'can-not-vote-for-yourself',
          duration: 3000,
          speed: 300,
        });
      },
      whenCurrentUserCantRaiseYourRating() {
        this.$notify({
          group: 'can-not-raise-your-rating',
          duration: 3000,
          speed: 300,
        });
      },
    },
  };
</script>

<style lang="less">
  @import '~LessStyle/contestmember.less';

  // CODE STYLE NOTE: if you want name this class in different way you can
  .member-likes_contest-type-1 {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 600;
    margin: 0;
    width: 85%;
    padding: 0 10px;
  }

  .member-likes_contest-type-1__heart-icon {
    .text-red-grad();
  }

  .member-likes_contest-type-1_disabled__heart-icon {
    .text-gray-grad();
  }

  .member-likes_contest-type-1__counter {
    color: @red;
    font-size: 0.475em;
    font-weight: 900;
    display: inline-block;
    margin-top: 2px;
  }

  .member-likes_contest-type-1_disabled__counter {
    color: @middle_grey;
  }

  .likes-block {
    position: absolute;
    width: 85%;
    bottom: 55%;
    left: 50%;
    transform: translate(-50%, 135%);
    line-height: 10px;
  }

  .likes-block_contest-type-1__heart-icon {
    position: relative;
    right: 0px;
    font-size: 10px;
    width: 14px;
  }

  .block-disabled {
    background: @gray-grad;
  }

  .text-disabled {
    .text-gray-grad();
  }

  .member-nickname {
    font-weight: normal;
    font-size: 5vw;
    margin: unset;
    position: relative;
  }

  .member-nickname__nickname {
    font-weight: 600;
    font-size: 3.5vw !important;
    margin: 0 0 4% 0;
    color: #0051bc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .member-nickname__nickname_gradient {
    .text-grad();
    display: inline !important;
    font-size: 3.5vw !important;
  }

  .member-nickname__dots {
    position: absolute;
    right: 0.1em;
    font-size: 3.5vw !important;
    top: 0;
    font-weight: 600;
    background: linear-gradient(to left top, #000fbc, #0553bc 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .member-nickname .nickname__official-icon {
    font-size: 5vw !important;
  }

  .member-place__name {
    display: flex;
    flex-flow: column nowrap;

  }
</style>
