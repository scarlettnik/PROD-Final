"use client";

import InputField from "@/style/InputField";
import { HOME_ROUTE, REGISTER_ROUTE } from "@/routes";
import Link from "next/link";
import { auth } from "@/services/firebase";
import { loginValidation } from "@/validator/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import useAuthentication from "@/hooks/useAuthentication";
import styles from "@/ui/auth.module.css";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = loginValidation();
  const router = useRouter();
  useAuthentication();
  const submitForm = (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((response) => {
        router.push(HOME_ROUTE);
      })
      .catch((e) => {
        console.log("Login Error ", e.message);
        alert("Please try Again");
      });
  };

  return (
    <div className={styles.form}>
      <div className={styles.formData}>
        <div>
          <span>Welcome To SignIn</span>
        </div>
        <br />
        <form onSubmit={handleSubmit(submitForm)}>
          <div className={styles.inputData}>
            <InputField
              register={register}
              error={errors.email}
              type="text"
              placeholder="Enter Your Email Here..."
              name="email"
              label="Email"
            />
          </div>
          <div>
            <InputField
              className={styles.inputData}
              register={register}
              error={errors.password}
              type="password"
              placeholder="Enter Your Password Here..."
              name="password"
              label="Password"
            />
          </div>
          <div>
            <button className={styles.button} variant="contained">Войти</button>
          </div>
        </form>
        <br />
        <div>
          <span>
            Don't have an account?
            <Link href={REGISTER_ROUTE}>
              <span> Register Here</span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
