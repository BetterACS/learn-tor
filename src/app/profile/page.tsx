'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Footer, Test, TestMutation } from '@/components/index';

export default function Profile() {
    return (
        <>
            <Navbar />
            <div className="pt-5">
                <div className="text-primary p-4">
                    <h1>บัญชีและความปลอดภัย</h1>
                </div>
            </div>
            <Footer />
        </>
    );
}
