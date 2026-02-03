export function elapsedTime(createdAt, lang = "pt") {
  const agora = new Date();
  const dataRegistro = new Date(createdAt);

  const diffMs = agora - dataRegistro;
  const diffSeg = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSeg / 60);
  const diffHora = Math.floor(diffMin / 60);
  const diffDia = Math.floor(diffHora / 24);
  const diffMes = Math.floor(diffDia / 30);
  const diffAno = Math.floor(diffDia / 365);

  const texts = {
    pt: {
      now: "agora mesmo",
      minute: "minuto",
      hour: "hora",
      day: "dia",
      month: "mês",
      year: "ano",
      plural: (count) => (count > 1 ? "s" : ""),
      format: (value, unit) => `há ${value} ${unit}`,
    },
    en: {
      now: "just now",
      minute: "minute",
      hour: "hour",
      day: "day",
      month: "month",
      year: "year",
      plural: (count) => (count > 1 ? "s" : ""),
      format: (value, unit) => `${value} ${unit} ago`,
    },
  };

  const t = texts[lang];

  if (diffSeg < 60) return t.now;
  if (diffMin < 60) return t.format(diffMin, `${t.minute}${t.plural(diffMin)}`);
  if (diffHora < 24) return t.format(diffHora, `${t.hour}${t.plural(diffHora)}`);
  if (diffDia < 30) return t.format(diffDia, `${t.day}${t.plural(diffDia)}`);
  if (diffMes < 12) return t.format(diffMes, `${t.month}${t.plural(diffMes)}`);
  return t.format(diffAno, `${t.year}${t.plural(diffAno)}`);
}

