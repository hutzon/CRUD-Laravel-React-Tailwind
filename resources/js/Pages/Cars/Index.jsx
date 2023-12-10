import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DangerButton from "@/Components/DangerButton";
import PrimaryButton from "@/Components/PrimaryButton";
import WarningButton from "@/Components/WarningButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import Select from "@/Components/Select";
import Swal from "sweetalert2";

import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";

export default function Dashboard(props) {
    const { auth, cars } = props;
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState("");
    const [operation, setOperation] = useState(1);
    const MakeInput = useRef();
    const ModelInput = useRef();
    const ColorInput = useRef();
    const {
        data,
        setData,
        delete: destroy,
        post,
        put,
        processing,
        reset,
        errors,
    } = useForm({
        id: "",
        make: "",
        model: "",
        color: "",
    });

    const openModal = (op, id, make, model, color) => {
        setModal(true);
        setOperation(op);
        setData({ make: "", model: "", color: "" });
        if (op === 1) {
            setTitle("Agregar auto");
            setData({ id: "", make: "", model: "", color: "" });
        } else {
            setTitle("Editar auto");
            setData({ id: id, make: make, model: model, color: color });
        }
    };

    const closeModal = () => {
        setModal(false);
    };

    const save = (e) => {
        console.log("Save function called");
        e.preventDefault();
        if (operation === 1) {
            console.log("Data to post", data);
            post(route("cars.store"), {
                onSuccess: () => {
                    console.log("Operation successful");
                    ok("Auto guardado");
                },
                onError: () => {
                    console.log("Operation failed", errors);
                    if (errors.make) {
                        reset("make");
                        MakeInput.current.focus();
                    }
                    if (errors.model) {
                        reset("model");
                        ModelInput.current.focus();
                    }
                    if (errors.color) {
                        reset("color");
                        ColorInput.current.focus();
                    }
                },
            });
        } else {
            console.log("Data to put", data);
            put(route("cars.update", data.id), {
                onSuccess: () => {
                    console.log("Operation successful");
                    ok("Auto modificado");
                },
                onError: () => {
                    console.log("Operation failed", error);
                    if (errors.make) {
                        reset("make");
                        MakeInput.current.focus();
                    }
                    if (errors.model) {
                        reset("model");
                        ModelInput.current.focus();
                    }
                    if (errors.color) {
                        reset("color");
                        ColorInput.current.focus();
                    }
                },
            });
        }
    };

    const ok = (mensaje) => {
        reset();
        closeModal();
        Swal.fire({ title: mensaje, icon: "success" });
    };

    const eliminar = (id, name) => {
        const alerta = Swal.mixin({ buttonsStyling: true });
        alerta
            .fire({
                title: "Seguro de eliminar el auto " + name,
                text: "Se perderá el auto",
                icon: "question",
                showCancelButton: true,
                confirmButtonText:
                    '<i class="fa-solid fa-check"></i> Si, eliminar',
                cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    destroy(route("cars.destroy", id), {
                        onSuccess: () => {
                            ok("Auto eliminado");
                        },
                    });
                }
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Cars
                </h2>
            }
        >
            <Head title="Cars" />

            <div className="grid bg-white v-screen place-items-center">
                <div className="flex justify-end my-3">
                    <PrimaryButton onClick={() => openModal(1)}>
                        <i className="fa-solid fa-plus-circle"></i>
                        Anadir
                    </PrimaryButton>
                </div>
            </div>

            <div className="grid py-6 bg-white v-screen place-items-center">
                <table className="border border-gray-400 table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">#</th>
                            <th className="p-2">MARCA</th>
                            <th className="p-2">MODELO</th>
                            <th className="p-2">COLOR</th>
                            <th className="p-2"></th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car, id) => (
                            <tr key={(car, id)}>
                                <td className="p-2 border border-gray-400">
                                    {id + 1}
                                </td>
                                <td className="p-2 border border-gray-400">
                                    {car.make}
                                </td>
                                <td className="p-2 border border-gray-400">
                                    {car.model}
                                </td>
                                <td className="p-2 border border-gray-400">
                                    <i
                                        className={
                                            "fa-solid fa-car text-" +
                                            car.color +
                                            "-600"
                                        }
                                    ></i>
                                </td>
                                <td className="p-2 border border-gray-400">
                                    <WarningButton
                                        onClick={() =>
                                            openModal(
                                                2,
                                                car.id,
                                                car.make,
                                                car.model,
                                                car.color
                                            )
                                        }
                                    >
                                        <i className="fa-solid fa-edit"></i>
                                    </WarningButton>
                                </td>
                                <td className="p-2 border border-gray-400">
                                    <DangerButton
                                        onClick={() =>
                                            eliminar(car.id, car.make)
                                        }
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </DangerButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={modal} onClose={closeModal}>
                <h2 className="p-3 text-lg font-medium text-gray-900">
                    {title}
                </h2>
                <form onSubmit={save} className="p-6">
                    <div className="p-6">
                        <InputLabel htmlFor="make" value="Marca"></InputLabel>
                        <TextInput
                            id="make"
                            name="make"
                            ref={MakeInput}
                            value={data.make}
                            required
                            onChange={(e) =>
                                setData({ ...data, make: e.target.value })
                            }
                            className="block w-3/4 mt-1"
                            isFocused
                        ></TextInput>
                        <InputError
                            message={errors.make}
                            className-2
                        ></InputError>
                    </div>
                    <div className="p-6">
                        <InputLabel htmlFor="model" value="Modelo"></InputLabel>
                        <TextInput
                            id="model"
                            name="model"
                            ref={ModelInput}
                            value={data.model}
                            required
                            onChange={(e) =>
                                setData({ ...data, model: e.target.value })
                            }
                            className="block w-3/4 mt-1"
                        ></TextInput>
                        <InputError
                            message={errors.model}
                            className-2
                        ></InputError>
                    </div>

                    <div className="p-6">
                        <InputLabel htmlFor="color" value="Color"></InputLabel>
                        <Select
                            id="color"
                            name="color"
                            value={data.color}
                            required
                            handleChange={(e) =>
                                setData({ ...data, color: e.target.value })
                            }
                            className="block w-3/4 mt-1"
                            options={[
                                "gray",
                                "red",
                                "yellow",
                                "green",
                                "purple",
                            ]}
                        />
                        <InputError
                            message={errors.color}
                            className-2
                        ></InputError>
                    </div>
                    <div className="flex justify-end mt-6">
                        <PrimaryButton
                            disabled={processing}
                            onClick={save}
                            className="mt-2"
                        >
                            <i className="fa-solid fa-save"></i>Guardar
                        </PrimaryButton>
                    </div>
                    <div className="flex justify-end mt-6">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
