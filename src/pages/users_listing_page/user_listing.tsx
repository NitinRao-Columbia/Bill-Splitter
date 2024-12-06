import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import "./user_listing.css";

interface User {
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

const UserListing: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1); // Current page number
    const [limit] = useState<number>(5); // Number of users per page
    const [totalUsers, setTotalUsers] = useState<number>(0); // Total users from the backend

    const fetchUsers = async (page: number) => {
        const skip = (page - 1) * 10;
        try {
            // Fetch paginated users
            const response: AxiosResponse<User[]> = await axios.get<User[]>(
                `http://3.145.144.209:8001/users?skip=${skip}`
            );
            setUsers(response.data);

            // Fetch total users count
            if (totalUsers === 0) {
                const totalResponse: AxiosResponse<{ total: number }> = await axios.get(
                    "http://3.145.144.209:8001/users/count"
                );
                setTotalUsers(totalResponse.data.total);
            }
        } catch {
            setError("Failed to fetch user data.");
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const totalPages = Math.ceil(totalUsers / limit);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="user-listing">
            <h1>User Listing</h1>
            {error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>User Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.email}>
                                    <td>{`${user.first_name} ${user.last_name}`}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={handlePreviousPage} disabled={page === 1}>
                            Previous
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button onClick={handleNextPage} disabled={page === totalPages}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserListing;
