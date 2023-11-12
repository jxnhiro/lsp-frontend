import { useEffect, useRef, useState } from 'react';
import * as z from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createRef } from 'react';
import { set } from 'date-fns';

function Kendaraan() {
  const [allKendaraan, setAllKendaraan] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllKendaraan();
  }, []);

  async function getAllKendaraan() {
    try {
      const request = await axios.get('http://localhost:8000/kendaraan');
      setAllKendaraan(request.data.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteKendaraan(id: number) {
    try {
      const request = await axios.delete(
        `http://localhost:8000/kendaraan/hapus/${id}`
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) {
    return <h1>Loading</h1>;
  } else {
    return (
      <div className="h-fit">
        <h1 className="text-3xl">List Kendaraan</h1>
        <div className="w-full">
          <div className="flex justify-end content-end gap-4">
            <Link to="/" className={buttonVariants({ variant: 'default' })}>
              Balik ke Pesanan
            </Link>
            <Dialog>
              <DialogTrigger>
                <Button>Tambah Kendaraan</Button>
              </DialogTrigger>
              <DialogContent className={'h-3/4 overflow-y-scroll'}>
                <DialogHeader>
                  <DialogTitle>
                    Tambahkan Kendaraan yang Ingin Anda Jual
                  </DialogTitle>
                </DialogHeader>
                <TambahKendaraan />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="pt-8 w-4/5">
            {allKendaraan.map((kendaraan) => {
              return (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>
                      {kendaraan.manufaktur} - {kendaraan.model}{' '}
                      {kendaraan.tahun}
                    </CardTitle>
                    <CardDescription>Rp{kendaraan.harga}</CardDescription>
                  </CardHeader>
                  <CardContent className="w-full flex justify-center">
                    <img
                      className="object-content h-24"
                      src={`http://localhost:8000/${kendaraan.gambar}`}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-center gap-4">
                    <Dialog>
                      <DialogTrigger>
                        <Button>Ubah Kendaraan</Button>
                      </DialogTrigger>
                      <DialogContent className={'h-3/4 overflow-y-scroll'}>
                        <DialogHeader>
                          <DialogTitle>
                            Ubah Kendaraan Sesuai Yang Ingin Dijual
                          </DialogTitle>
                        </DialogHeader>
                        <UbahKendaraan kendaraan={kendaraan} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={() => {
                        deleteKendaraan(kendaraan.id);
                      }}
                    >
                      Delete Kendaraan
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const kendaraanSchema = z.object({
  model: z.string().min(2),
  tahun: z.coerce.number().min(1700),
  jumlah_penumpang: z.coerce.number().min(1),
  manufaktur: z.string().min(2),
  harga: z.coerce.number().min(10000000),
  tipe_kendaraan: z.string(),
  gambar: z.string().min(0),
  tipe_bahan_bakar: z.string().default(''),
  luas_bagasi: z.coerce.number().default(0),
  ukuran_bagasi: z.coerce.number().default(0),
  kapasitas_bensin: z.coerce.number().default(0),
  jumlah_roda_ban: z.coerce.number().default(0),
  luas_area_kargo: z.coerce.number().default(0),
});

interface Kendaraan {
  model: string;
  tahun: number;
  jumlah_penumpang: number;
  manufaktur: string;
  harga: number;
  tipe_kendaraan: string;
}

interface Mobil extends Kendaraan {
  tipe_bahan_bakar: string;
  luas_bagasi: number;
}

interface Motor extends Kendaraan {
  ukuran_bagasi: number;
  kapasitas_bensin: number;
}

interface Truck extends Kendaraan {
  jumlah_roda_ban: number;
  luas_area_kargo: number;
}

function UbahKendaraan(props) {
  const kendaraan = props.kendaraan;

  const [tipeKendaraan, setTipeKendaraan] = useState(kendaraan.tipe_kendaraan);
  const [file, setFile] = useState<File>();
  const [errorMessage, setErrorMessage] = useState('');
  let formData = new FormData();

  let form;
  if (kendaraan.tipe_kendaraan === 'MOBIL') {
    form = useForm<z.infer<typeof kendaraanSchema>>({
      resolver: zodResolver(kendaraanSchema),
      defaultValues: {
        model: kendaraan.model,
        tahun: kendaraan.tahun,
        jumlah_penumpang: kendaraan.jumlah_penumpang,
        manufaktur: kendaraan.manufaktur,
        harga: kendaraan.harga,
        gambar: kendaraan.gambar,
        tipe_kendaraan: kendaraan.tipe_kendaraan,
        tipe_bahan_bakar: kendaraan.Mobil.tipe_bahan_bakar,
        luas_bagasi: kendaraan.Mobil.luas_bagasi,
      },
    });
  } else if (kendaraan.tipe_kendaraan === 'MOTOR') {
    form = useForm<z.infer<typeof kendaraanSchema>>({
      resolver: zodResolver(kendaraanSchema),
      defaultValues: {
        model: kendaraan.model,
        tahun: kendaraan.tahun,
        jumlah_penumpang: kendaraan.jumlah_penumpang,
        manufaktur: kendaraan.manufaktur,
        harga: kendaraan.harga,
        gambar: kendaraan.gambar,
        tipe_kendaraan: kendaraan.tipe_kendaraan,
        ukuran_bagasi: kendaraan.Motor.ukuran_bagasi,
        kapasitas_bensin: kendaraan.Motor.kapasitas_bensin,
      },
    });
  } else {
    if (kendaraan.tipe_kendaraan === 'TRUCK') {
      form = useForm<z.infer<typeof kendaraanSchema>>({
        resolver: zodResolver(kendaraanSchema),
        defaultValues: {
          model: kendaraan.model,
          tahun: kendaraan.tahun,
          jumlah_penumpang: kendaraan.jumlah_penumpang,
          manufaktur: kendaraan.manufaktur,
          harga: kendaraan.harga,
          gambar: kendaraan.gambar,
          tipe_kendaraan: kendaraan.tipe_kendaraan,
          jumlah_roda_ban: kendaraan.Truck.jumlah_roda_ban,
          luas_area_kargo: kendaraan.Truck.luas_area_kargo,
        },
      });
    }
  }
  async function putKendaraan(values: z.input<typeof kendaraanSchema>) {
    let kendaraan: Mobil | Motor | Truck;

    switch (tipeKendaraan) {
      case 'MOBIL':
        kendaraan = {
          model: values.model,
          tahun: values.tahun,
          jumlah_penumpang: values.jumlah_penumpang,
          manufaktur: values.manufaktur,
          harga: values.harga,
          tipe_kendaraan: tipeKendaraan,
          tipe_bahan_bakar: values.tipe_bahan_bakar,
          luas_bagasi: values.luas_bagasi,
        };
        if (kendaraan.tipe_bahan_bakar === '' || kendaraan.luas_bagasi === 0) {
          setErrorMessage('Fill the values');
          return;
        }
        Object.keys(kendaraan).forEach((key) => {
          formData.set(key, kendaraan[key]);
        });
        break;
      case 'MOTOR':
        kendaraan = {
          model: values.model,
          tahun: values.tahun,
          jumlah_penumpang: values.jumlah_penumpang,
          manufaktur: values.manufaktur,
          harga: values.harga,
          tipe_kendaraan: tipeKendaraan,
          ukuran_bagasi: values.ukuran_bagasi,
          kapasitas_bensin: values.kapasitas_bensin,
        };
        if (kendaraan.ukuran_bagasi === 0 || kendaraan.kapasitas_bensin === 0) {
          setErrorMessage('Fill the values');
          return;
        }
        Object.keys(kendaraan).forEach((key) => {
          formData.set(key, kendaraan[key]);
        });
        break;
      case 'TRUCK':
        kendaraan = {
          model: values.model,
          tahun: values.tahun,
          jumlah_penumpang: values.jumlah_penumpang,
          manufaktur: values.manufaktur,
          harga: values.harga,
          tipe_kendaraan: tipeKendaraan,
          jumlah_roda_ban: values.jumlah_roda_ban,
          luas_area_kargo: values.luas_area_kargo,
        };
        if (
          kendaraan.jumlah_roda_ban === 0 ||
          kendaraan.luas_area_kargo === 0
        ) {
          setErrorMessage('Fill the values');
          return;
        }
        Object.keys(kendaraan).forEach((key) => {
          formData.set(key, kendaraan[key]);
        });
        break;
    }

    if (file) {
      formData.append('gambar', file);
    }

    try {
      console.log(props.kendaraan.id);
      const response = await axios.put(
        `http://localhost:8000/kendaraan/ubah/${props.kendaraan.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(putKendaraan)} className="space-y-8">
        <FormField
          control={form.control}
          name="tipe_kendaraan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe Kendaraan</FormLabel>
              <Select
                onValueChange={(value) => {
                  setTipeKendaraan(value);
                  field.onChange(value);
                  form.reset();
                }}
                defaultValue="MOBIL"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tipe Kendaraan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MOBIL">Mobil</SelectItem>
                  <SelectItem value="MOTOR">Motor</SelectItem>
                  <SelectItem value="TRUCK">Truck</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="SUV" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tahun"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2018" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jumlah_penumpang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Penumpang</FormLabel>
              <FormControl>
                <Input type="number" placeholder="4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manufaktur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufaktur</FormLabel>
              <FormControl>
                <Input placeholder="Toyota" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="harga"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p>Drop Image Here</p>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />

        {
          {
            MOBIL: (
              <>
                <FormField
                  control={form.control}
                  name="tipe_bahan_bakar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Bahan Bakar</FormLabel>
                      <FormControl>
                        <Input placeholder="Solar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="luas_bagasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luas Bagasi</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),

            MOTOR: (
              <>
                <FormField
                  control={form.control}
                  name="ukuran_bagasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ukuran Bagasi</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kapasitas_bensin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasitas Bensin</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),

            TRUCK: (
              <>
                <FormField
                  control={form.control}
                  name="jumlah_roda_ban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Roda Ban</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="luas_area_kargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luas Area Kargo</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),
          }[tipeKendaraan]
        }
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function TambahKendaraan() {
  const [tipeKendaraan, setTipeKendaraan] = useState('MOBIL');
  const [file, setFile] = useState<File>();
  const [errorMessage, setErrorMessage] = useState('');
  let formData = new FormData();
  const form = useForm<z.infer<typeof kendaraanSchema>>({
    resolver: zodResolver(kendaraanSchema),
    defaultValues: {
      model: '',
      tahun: 0,
      jumlah_penumpang: 0,
      manufaktur: '',
      harga: 0,
      gambar: '',
      tipe_kendaraan: '',
      tipe_bahan_bakar: '',
      luas_bagasi: 0,
      ukuran_bagasi: 0,
      kapasitas_bensin: 0,
      jumlah_roda_ban: 0,
      luas_area_kargo: 0,
    },
  });

  async function postKendaraan(values: z.input<typeof kendaraanSchema>) {
    let kendaraan: Mobil | Motor | Truck;

    switch (tipeKendaraan) {
      case 'MOBIL':
        kendaraan = {
          model: values.model,
          tahun: values.tahun,
          jumlah_penumpang: values.jumlah_penumpang,
          manufaktur: values.manufaktur,
          harga: values.harga,
          tipe_kendaraan: tipeKendaraan,
          tipe_bahan_bakar: values.tipe_bahan_bakar,
          luas_bagasi: values.luas_bagasi,
        };
        if (kendaraan.tipe_bahan_bakar === '' || kendaraan.luas_bagasi === 0) {
          setErrorMessage('Fill the values');
          return;
        }
        Object.keys(kendaraan).forEach((key) => {
          formData.set(key, kendaraan[key]);
        });
        break;
      case 'MOTOR':
        kendaraan = {
          model: values.model,
          tahun: values.tahun,
          jumlah_penumpang: values.jumlah_penumpang,
          manufaktur: values.manufaktur,
          harga: values.harga,
          tipe_kendaraan: tipeKendaraan,
          ukuran_bagasi: values.ukuran_bagasi,
          kapasitas_bensin: values.kapasitas_bensin,
        };
        if (kendaraan.ukuran_bagasi === 0 || kendaraan.kapasitas_bensin === 0) {
          setErrorMessage('Fill the values');
          return;
        }
        Object.keys(kendaraan).forEach((key) => {
          formData.set(key, kendaraan[key]);
        });
        break;
      case 'TRUCK':
        kendaraan = {
          model: values.model,
          tahun: values.tahun,
          jumlah_penumpang: values.jumlah_penumpang,
          manufaktur: values.manufaktur,
          harga: values.harga,
          tipe_kendaraan: tipeKendaraan,
          jumlah_roda_ban: values.jumlah_roda_ban,
          luas_area_kargo: values.luas_area_kargo,
        };
        if (
          kendaraan.jumlah_roda_ban === 0 ||
          kendaraan.luas_area_kargo === 0
        ) {
          setErrorMessage('Fill the values');
          return;
        }
        Object.keys(kendaraan).forEach((key) => {
          formData.set(key, kendaraan[key]);
        });
        break;
    }

    formData.append('gambar', file);
    console.log(formData);
    try {
      const response = await axios.post(
        'http://localhost:8000/kendaraan/tambah',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(postKendaraan)} className="space-y-8">
        <FormField
          control={form.control}
          name="tipe_kendaraan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe Kendaraan</FormLabel>
              <Select
                onValueChange={(value) => {
                  setTipeKendaraan(value);
                  field.onChange(value);
                  form.reset();
                }}
                defaultValue="MOBIL"
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tipe Kendaraan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MOBIL">Mobil</SelectItem>
                  <SelectItem value="MOTOR">Motor</SelectItem>
                  <SelectItem value="TRUCK">Truck</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="SUV" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tahun"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2018" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jumlah_penumpang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Penumpang</FormLabel>
              <FormControl>
                <Input type="number" placeholder="4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manufaktur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufaktur</FormLabel>
              <FormControl>
                <Input placeholder="Toyota" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="harga"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p>Drop Image Here</p>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />

        {
          {
            MOBIL: (
              <>
                <FormField
                  control={form.control}
                  name="tipe_bahan_bakar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Bahan Bakar</FormLabel>
                      <FormControl>
                        <Input placeholder="Solar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="luas_bagasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luas Bagasi</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),

            MOTOR: (
              <>
                <FormField
                  control={form.control}
                  name="ukuran_bagasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ukuran Bagasi</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kapasitas_bensin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kapasitas Bensin</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),

            TRUCK: (
              <>
                <FormField
                  control={form.control}
                  name="jumlah_roda_ban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Roda Ban</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="luas_area_kargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luas Area Kargo</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ),
          }[tipeKendaraan]
        }
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
export default Kendaraan;
