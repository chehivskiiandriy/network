export default class GroupAccess {
  static compareRoles(left, right) {
    const leftValue = this.roleValues[left] || this.roleValues.other,
      rightValue = this.roleValues[right] || this.roleValues.other;
    if (leftValue === rightValue) {
      return 0;
    }
    return leftValue < rightValue
      ? -1
      : 1;
  }

  static canIDo(currentUserRole, currentUserNickname, targetUserRole, targetUserNickname, action) {
    const actionData = this.actions[action];
    return actionData && ((currentUserNickname !== targetUserNickname) || actionData.canDoForMyself) &&
      actionData.haveAccess.indexOf(currentUserRole) !== -1 &&
      this.compareRoles(currentUserRole, targetUserRole) > 0;
  }
}

GroupAccess.actions = {
  'blacklist': {
    haveAccess: ['moderator', 'admin'],
    canDoForMyself: false,
  },
  'remove-from-group': {
    haveAccess: ['moderator', 'admin'],
    canDoForMyself: false,
  },
  'add-moderator': {
    haveAccess: ['admin'],
    canDoForMyself: false,
  },
  'remove-moderator': {
    haveAccess: ['admin'],
    canDoForMyself: false,
  },
  'accept-request': {
    haveAccess: ['admin'],
    canDoForMyself: false,
  },
  'delete-post': {
    haveAccess: ['moderator', 'admin'],
    canDoForMyself: true,
  },
  'make-posts-on-behalf-of-the-group': {
    haveAccess: ['moderator', 'admin'],
    canDoForMyself: true,
  },
};

GroupAccess.roles = [
  'admin',
  'moderator',
  'participant',
  'other',
];


/* Next code automatically set role values for each roles */
GroupAccess.roleValues = {};
GroupAccess.roles.forEach((role, index, roles) => {
  const value = roles.length - index;
  if(typeof role === 'string') {
    GroupAccess.roleValues[role] = value;
  } else if(Array.isArray(role)) {
    role.forEach(subrole => {
      GroupAccess.roleValues[subrole] = value;
    });
  }
});
