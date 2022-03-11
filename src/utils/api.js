const API_ENDPOINT =
  'https://uikt6pohhh.execute-api.ap-northeast-2.amazonaws.com/dev/products';

export const request = async url => {
  try {
    const result = await fetch(`${API_ENDPOINT}${url}`);

    if (!result.ok) {
      throw new Error('API 호출에 실패하였습니다.');
    }

    return {
      isError: false,
      data: await result.json(),
    };
  } catch (e) {
    return {
      isError: true,
      data: e.message,
    };
  }
};
