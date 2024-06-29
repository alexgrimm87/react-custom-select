const baseUrl =  'https://parseapi.back4app.com/';
const limit = 100000;

export const fetchData = async () => {
  const response = await fetch(
    `${baseUrl}classes/Complete_List_Names?limit=${limit}`,
    {
      headers: {
        'X-Parse-Application-Id': import.meta.env.APP_BACK4APP_DEMO_ID,
        'X-Parse-Master-Key': import.meta.env.APP_BACK4APP_DEMO_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error('Response error');
  }

  const data = await response.json();
  return data.results.map(item => item.Name);
};
