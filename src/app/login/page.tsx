"use client";

import "@/app/login/style.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";

export const description =
	"A simple login form with email and password. The submit button says 'Sign in'.";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const login = useAuth(state => state.login);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(email, password);
			router.push("/my-info/time-off");
		} catch (error) {
			console.error("Ошибка при входе:", error);
		}
	};

	return (
		<div className='login'>
			<form onSubmit={handleSubmit}>
				<Card className='w-full max-w-sm'>
					<CardHeader>
						<CardTitle className='text-2xl'>Login</CardTitle>
						<CardDescription>
							Enter your email below to login to your account.
						</CardDescription>
					</CardHeader>
					<CardContent className='grid gap-4'>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='m@example.com'
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button className='w-full'>Sign in</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
}
