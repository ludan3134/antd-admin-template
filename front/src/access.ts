/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function (initialState = {}) {
  const {currentUser} = initialState;
  return currentUser?.currentAuthority?.reduce((acc, authority) => ({
    ...acc,
    [authority]: true
  }), {}) || {};  // 如果没有 currentAuthority，返回空对象
}
