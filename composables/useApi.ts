export const useApiBase = () => {
  const config = useRuntimeConfig();
  const apiBase = `${config.public.apiBase}/logs`;

  return { apiBase };
};
