import { GetFormWithSubmissions, GetFormsById } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import React, { ReactNode } from "react";
import { TbArrowBounce } from "react-icons/tb";
import { StatsCard } from "../../page";
import { HiCursorClick } from "react-icons/hi";
import { FaWpforms } from "react-icons/fa";
import { LuView } from "react-icons/lu";
import { ElementsType, FormElementsInstance } from "@/components/FormElements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const FormDetailsPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const form = await GetFormsById(Number(params.id));

  if (!form) {
    throw new Error("Form not found");
  }

  const { visits, submissions } = form;
  let submissionRate = 0;
  let bounceRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
    bounceRate = 100 - submissionRate;
  }

  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareUrl={form.shareURL} />
        </div>
        <div className="py-4 border-b border-muted">
          <div className="container flex gap-3 items-center justify-between">
            {" "}
            <FormLinkShare shareUrl={form.shareURL} />
          </div>
        </div>
      </div>
      <div className="w-full pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="Total Visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          value={visits.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-blue-600"
        />
        <StatsCard
          title="Total Submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="All time form submissions"
          value={submissions.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />
        <StatsCard
          title="Total submission rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="Visits that result in form submission"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-green-600"
        />
        <StatsCard
          title="Bounce rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="Visitors that left without interacting"
          value={bounceRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>
      <div className="container pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </>
  );
};
type RowType = {
  [key: string]: string;
} & { submittedAt: Date };
export default FormDetailsPage;

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);
  if (!form) {
    throw new Error("Form not found");
  }
  const formElements = JSON.parse(form.content) as FormElementsInstance[];

  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];
  formElements.forEach((element) => {
    switch (element.type) {
      case "Textfield":
      case "NumberField":
      case "TextAreaField":
      case "CheckboxField":
      case "SelectField":
      case "DateField":
        columns.push({
          id: element.id,
          label: element?.extraAttributes?.label,
          required: element?.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });
  const row: RowType[] = [];
  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content);
    row.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <div className="text-2xl font-bold my-4">
      <h1>Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="tet-muted-foreground text-right uppercase">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {row.map((r, i) => (
              <TableRow key={i}>
                {columns.map((c, i) => (
                  <RowCell key={c.id} type={c.type} value={r[c.id]} />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(r.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) {
        const date = new Date(value);
        node = <Badge variant={"outline"}>{format(date, "dd/MM/yyy")}</Badge>;
      }
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
  }

  return <TableCell>{node}</TableCell>;
}
