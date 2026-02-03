import Swal from "sweetalert2";

export const alertError = (title, text) => {
  Swal.fire({
    icon: "error",
    title,
    text,
  });
};

export const alertWarning = (title, text) => {
  Swal.fire({
    icon: "warning",
    title,
    text,
  });
};

export const alertSuccess = (title, text) => {
  Swal.fire({
    icon: "success",
    title,
    text,
  });
};

