"use client";
import InputField from "@/style/InputField";
import { LOGIN_ROUTE, HOME_ROUTE } from "@/routes";
import useAuthentication from "@/hooks/useAuthentication";
import { db } from "@/services/firebase";
import { registerValidation } from "@/validator/auth";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";

const Register = () => {
  const router = useRouter();
  useAuthentication();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = registerValidation();

  const submitForm = async (values) => {
    try {
      const { email, password } = values;
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, uid);

      await setDoc(userDoc, {
        uid, 
        email,
        level: 0,
        wallet: 5,
        maxHabit: 10,
        maxGroup: 5,
        maraphones: [],
        groups: [],
      });

      reset();
      router.push(HOME_ROUTE);
    } catch (error) {
      console.log("catch ", error.message);
      alert(error.message);
    }
  };

  return (
    <div>
      <div>
        <div>
          <span>Welcome To Register</span>
        </div>
        <form onSubmit={handleSubmit(submitForm)}>
          <InputField
            register={register}
            error={errors.email}
            type="text"
            placeholder="Enter Your Email Here..."
            name="email"
            label="Email"
          />
          <InputField
            register={register}
            error={errors.password}
            type="password"
            placeholder="Enter Your Password Here..."
            name="password"
            label="Password"
          />
          <InputField
            register={register}
            error={errors.cnfPassword}
            type="password"
            placeholder="Enter Your Confirm Password Here..."
            name="cnfPassword"
            label="Confirm Password"
          />
          <button>Регистрация</button>
        </form>
        <div>
          <span>
            Already have account?
            <Link href={LOGIN_ROUTE}>
              <span> Login Here</span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
