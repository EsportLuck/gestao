import { FC } from "react";
import { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { TFormSchema } from "../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ErrorMessageInput,
} from "@/components/ui";
import {
  useEmpresas,
  useLocalidades,
  useSecoes,
  useRota,
  useSupervisores,
  useEstabelecimentos,
} from "@/shared/hooks";
import { useSession } from "next-auth/react";

interface SelectFiltersProps {
  control: Control<TFormSchema>;
  errors: any;
}

export const SelectFilters: FC<SelectFiltersProps> = ({ control, errors }) => {
  const { data: infoUser } = useSession();
  const { empresas } = useEmpresas();
  const { localidades } = useLocalidades();
  const { secao } = useSecoes();
  const { supervisores } = useSupervisores();
  const { rotas } = useRota();
  const { estabelecimentos } = useEstabelecimentos();

  const isSupervisor = infoUser?.user.role === "supervisor";
  const isAdmin = infoUser?.user.role === "administrador";

  return (
    <>
      {/* Location and Section */}
      <div className="flex gap-4 col-span-1">
        <div className="w-full">
          <Controller
            control={control}
            name="localidade"
            render={({ field }) => (
              <div className="grid gap-1">
                <label className="text-sm text-muted-foreground">
                  Localidade
                </label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Localidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {localidades && localidades.length > 0 ? (
                        localidades.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.name ? item.name : ""}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="Sem dados">
                          Nenhuma dado encontrado
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors["localidade"] && (
                  <ErrorMessageInput
                    className="mt-1"
                    error={errors}
                    name={"localidade"}
                  />
                )}
              </div>
            )}
          />
        </div>

        <div className="w-full">
          <Controller
            control={control}
            name="secao"
            render={({ field }) => (
              <div className="grid gap-1">
                <label className="text-sm text-muted-foreground">Seção</label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {secao && secao.length > 0 ? (
                        secao.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.name ? item.name : ""}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="Sem dados">
                          Nenhuma dado encontrado
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors["secao"] && (
                  <ErrorMessageInput
                    className="mt-1"
                    error={errors}
                    name={"secao"}
                  />
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Route and Supervisor */}
      <div className="flex gap-4 col-span-1">
        <div className="w-full">
          <Controller
            control={control}
            name="rota"
            render={({ field }) => (
              <div className="grid gap-1">
                <label className="text-sm text-muted-foreground">Rota</label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSupervisor}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Rota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {rotas ? (
                        rotas.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.id?.toString() as string}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="Sem dados">
                          Nenhuma dado encontrado
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors["rota"] && (
                  <ErrorMessageInput
                    className="mt-1"
                    error={errors}
                    name={"rota"}
                  />
                )}
              </div>
            )}
          />
        </div>

        <div className="w-full">
          <Controller
            control={control}
            name="supervisor"
            render={({ field }) => (
              <div className="grid gap-1">
                <label className="text-sm text-muted-foreground">
                  Supervisor
                </label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSupervisor}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {supervisores && supervisores.length > 0 ? (
                        supervisores.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.name ? item.name : ""}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="Sem dados">
                          Nenhuma dado encontrado
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors["supervisor"] && (
                  <ErrorMessageInput
                    className="mt-1"
                    error={errors}
                    name={"supervisor"}
                  />
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Establishment and Company */}
      <div className="grid grid-cols-2 md:col-span-3 gap-4 w-full">
        <div className="w-full">
          <Controller
            control={control}
            name="estabelecimento"
            render={({ field }) => (
              <div className="grid gap-1">
                <label className="text-sm text-muted-foreground">
                  Estabelecimento
                </label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSupervisor}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Estabelecimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {estabelecimentos && estabelecimentos.length > 0 ? (
                        estabelecimentos.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.id?.toString() as string}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="Sem dados">
                          Nenhuma dado encontrado
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors["estabelecimento"] && (
                  <ErrorMessageInput
                    className="mt-1"
                    error={errors}
                    name={"estabelecimento"}
                  />
                )}
              </div>
            )}
          />
        </div>

        <div className="w-full">
          <Controller
            control={control}
            name="empresa"
            render={({ field }) => (
              <div className={`grid gap-1 ${!isAdmin ? "hidden" : ""}`}>
                <label className="text-sm text-muted-foreground">Empresa</label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isAdmin}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {empresas && empresas.length > 0 ? (
                        empresas.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item.id?.toString() as string}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="Carregando...">
                          {"Carregando..."}
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors["empresa"] && (
                  <ErrorMessageInput
                    className="mt-1"
                    error={errors}
                    name={"empresa"}
                  />
                )}
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
};
