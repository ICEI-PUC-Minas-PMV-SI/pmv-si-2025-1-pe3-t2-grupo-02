let dynamicData = {
  newCasesLast24Hours: 0,
  newOutbreakReportsLastWeek: 0,
  registeredMedicalCareLastMonth: 0,
};

async function getDynamicData() {
  let apiUrl;
  await fetch('../../config.json')
    .then((response) => response.json())
    .then((env) => {
      apiUrl = env.API_URL;
    });

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const parsedToday = today.toISOString().split('T')[0];
  const parsedYesterday = yesterday.toISOString().split('T')[0];
  await fetch(
    `${apiUrl}/denuncias-casos/?data_registro_gte=${encodeURIComponent(
      parsedYesterday
    )}&data_registro_lte=${encodeURIComponent(parsedToday)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      dynamicData.newCasesLast24Hours = data.length;
    });

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const parsedLastWeek = lastWeek.toISOString().split('T')[0];
  await fetch(
    `${apiUrl}/denuncias-focos/?data_registro_gte=${encodeURIComponent(
      parsedLastWeek
    )}&data_registro_lte=${encodeURIComponent(parsedToday)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      dynamicData.newOutbreakReportsLastWeek = data.length;
    });

  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const parsedLastMonth = lastMonth.toISOString().split('T')[0];
  await fetch(
    `${apiUrl}/denuncias-casos/?data_registro_gte=${encodeURIComponent(
      parsedLastMonth
    )}&data_registro_lte=${encodeURIComponent(
      parsedToday
    )}&atendido_em_posto=true`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      dynamicData.registeredMedicalCareLastMonth = data.length;
      document.getElementById('newCasesLast24Hours').innerHTML =
        dynamicData.newCasesLast24Hours;
      document.getElementById('newOutbreakReportsLastWeek').innerHTML =
        dynamicData.newOutbreakReportsLastWeek;
      document.getElementById('registeredMedicalCareLastMonth').innerHTML =
        dynamicData.registeredMedicalCareLastMonth;
    });
}

getDynamicData();

