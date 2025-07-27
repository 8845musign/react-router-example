import { Form } from "react-router";

import { getContact, type ContactRecord } from "../data";
import type { Route } from "./+types/contact";

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);

  return { contact };
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  if (!contact) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return (
    <div id="contact">
      <div>
        <div>
          <img
            src={contact.avatar}
            key={contact.avatar}
            alt={`${contact.first} ${contact.last} avatar`}
          />
        </div>

        <div>
          <h1>
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}
            <Favorite contact={contact} />
          </h1>
        </div>

        {contact.twitter && (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >{`${contact.twitter}`}</a>
          </p>
        )}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button>Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(e) => {
              const response = confirm("delete?");

              if (!response) {
                e.preventDefault();
              }
            }}
          >
            <button>Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const favorite = contact.favorite;

  return (
    <Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}
